import axios from "axios"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface WhatsAppMessage {
  messaging_product: "whatsapp"
  to: string
  type: string
  text?: {
    body: string
  }
  image?: {
    link: string
    caption?: string
  }
  document?: {
    link: string
    filename: string
    caption?: string
  }
  audio?: {
    link: string
  }
  video?: {
    link: string
    caption?: string
  }
}

export interface WhatsAppWebhookData {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          type: string
          text?: {
            body: string
          }
          image?: {
            caption?: string
            mime_type: string
            sha256: string
            id: string
          }
          document?: {
            caption?: string
            filename: string
            mime_type: string
            sha256: string
            id: string
          }
          audio?: {
            mime_type: string
            sha256: string
            id: string
            voice: boolean
          }
          video?: {
            caption?: string
            mime_type: string
            sha256: string
            id: string
          }
        }>
        statuses?: Array<{
          id: string
          status: string
          timestamp: string
          recipient_id: string
        }>
      }
      field: string
    }>
  }>
}

export class WhatsAppService {
  private accessToken: string
  private phoneNumberId: string
  private baseUrl = "https://graph.facebook.com/v18.0"

  constructor(accessToken: string, phoneNumberId: string) {
    this.accessToken = accessToken
    this.phoneNumberId = phoneNumberId
  }

  async sendMessage(message: WhatsAppMessage): Promise<any> {
    try {
      console.log("Sending WhatsApp message:", JSON.stringify(message, null, 2))

      const response = await axios.post(`${this.baseUrl}/${this.phoneNumberId}/messages`, message, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      console.log("WhatsApp API response:", response.data)
      return response.data
    } catch (error: any) {
      console.error("Error sending WhatsApp message:", error.response?.data || error.message)
      throw new Error(`WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  async sendTextMessage(to: string, text: string): Promise<any> {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""), // Remove non-digits
      type: "text",
      text: {
        body: text,
      },
    }

    return this.sendMessage(message)
  }

  async sendImageMessage(to: string, imageUrl: string, caption?: string): Promise<any> {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""),
      type: "image",
      image: {
        link: imageUrl,
        caption,
      },
    }

    return this.sendMessage(message)
  }

  async sendDocumentMessage(to: string, documentUrl: string, filename: string, caption?: string): Promise<any> {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""),
      type: "document",
      document: {
        link: documentUrl,
        filename,
        caption,
      },
    }

    return this.sendMessage(message)
  }

  async markAsRead(messageId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      return response.data
    } catch (error: any) {
      console.error("Error marking message as read:", error.response?.data || error.message)
      throw error
    }
  }

  async processWebhook(webhookData: WhatsAppWebhookData): Promise<void> {
    try {
      console.log("Processing webhook data:", JSON.stringify(webhookData, null, 2))

      for (const entry of webhookData.entry) {
        for (const change of entry.changes) {
          if (change.field === "messages") {
            const { messages, statuses, contacts } = change.value

            // Process incoming messages
            if (messages) {
              for (const message of messages) {
                await this.processIncomingMessage(message, contacts)
              }
            }

            // Process message status updates
            if (statuses) {
              for (const status of statuses) {
                await this.processMessageStatus(status)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing webhook:", error)
      throw error
    }
  }

  private async processIncomingMessage(message: any, contacts?: any[]): Promise<void> {
    try {
      const contact = contacts?.find((c) => c.wa_id === message.from)

      // Find or create contact
      let dbContact = await prisma.contact.findUnique({
        where: { phone: message.from },
      })

      if (!dbContact) {
        dbContact = await prisma.contact.create({
          data: {
            name: contact?.profile?.name || `Contato ${message.from}`,
            phone: message.from,
          },
        })
      }

      // Find or create conversation
      let conversation = await prisma.conversation.findFirst({
        where: {
          contactId: dbContact.id,
          status: { in: ["WAITING", "ATTENDING"] },
        },
      })

      if (!conversation) {
        // Find available queue (simple round-robin)
        const queue = await prisma.queue.findFirst({
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        })

        conversation = await prisma.conversation.create({
          data: {
            contactId: dbContact.id,
            queueId: queue?.id,
            status: "WAITING",
            priority: "MEDIUM",
            lastMessageAt: new Date(),
          },
        })
      }

      // Extract message content and type
      const { content, messageType, mediaUrl } = this.extractMessageData(message)

      // Create message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content,
          messageType,
          direction: "INBOUND",
          whatsappId: message.id,
          status: "DELIVERED",
          mediaUrl,
          sentAt: new Date(Number.parseInt(message.timestamp) * 1000),
        },
      })

      // Update conversation last message time
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      })

      console.log(`Message processed for contact ${dbContact.name} (${dbContact.phone})`)
    } catch (error) {
      console.error("Error processing incoming message:", error)
      throw error
    }
  }

  private async processMessageStatus(status: any): Promise<void> {
    try {
      const { id, status: messageStatus, timestamp } = status

      const updateData: any = {
        status: messageStatus.toUpperCase(),
      }

      if (messageStatus === "delivered") {
        updateData.deliveredAt = new Date(Number.parseInt(timestamp) * 1000)
      } else if (messageStatus === "read") {
        updateData.readAt = new Date(Number.parseInt(timestamp) * 1000)
      }

      await prisma.message.updateMany({
        where: { whatsappId: id },
        data: updateData,
      })

      console.log(`Message status updated: ${id} -> ${messageStatus}`)
    } catch (error) {
      console.error("Error processing message status:", error)
    }
  }

  private extractMessageData(message: any): { content: string; messageType: string; mediaUrl?: string } {
    switch (message.type) {
      case "text":
        return {
          content: message.text.body,
          messageType: "TEXT",
        }
      case "image":
        return {
          content: message.image.caption || "Imagem enviada",
          messageType: "IMAGE",
          mediaUrl: message.image.id,
        }
      case "document":
        return {
          content: message.document.filename || "Documento enviado",
          messageType: "DOCUMENT",
          mediaUrl: message.document.id,
        }
      case "audio":
        return {
          content: "Áudio enviado",
          messageType: "AUDIO",
          mediaUrl: message.audio.id,
        }
      case "video":
        return {
          content: message.video.caption || "Vídeo enviado",
          messageType: "VIDEO",
          mediaUrl: message.video.id,
        }
      default:
        return {
          content: `Mensagem do tipo: ${message.type}`,
          messageType: "TEXT",
        }
    }
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      return response.data.url
    } catch (error: any) {
      console.error("Error getting media URL:", error.response?.data || error.message)
      throw error
    }
  }

  async downloadMedia(mediaUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(mediaUrl, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        responseType: "arraybuffer",
      })

      return Buffer.from(response.data)
    } catch (error: any) {
      console.error("Error downloading media:", error.response?.data || error.message)
      throw error
    }
  }
}

export async function getActiveWhatsAppConnection() {
  const connection = await prisma.whatsAppConnection.findFirst({
    where: { isActive: true },
  })

  if (!connection) {
    throw new Error("No active WhatsApp connection found")
  }

  return new WhatsAppService(connection.accessToken, connection.phoneNumberId)
}
