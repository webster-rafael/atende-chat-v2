const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api"

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Conversations
  async getConversations(params?: {
    status?: string
    queueId?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)
    if (params?.queueId) searchParams.append("queueId", params.queueId)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    return this.request(`/conversations?${searchParams}`)
  }

  async getConversation(id: string) {
    return this.request(`/conversations/${id}`)
  }

  async assignConversation(id: string, userId: string) {
    return this.request(`/conversations/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  }

  async updateConversationStatus(id: string, status: string) {
    return this.request(`/conversations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  // Messages
  async sendMessage(data: {
    conversationId: string
    content: string
    userId: string
    messageType?: string
  }) {
    return this.request("/messages/send", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getMessages(conversationId: string, page = 1, limit = 50) {
    return this.request(`/messages/conversation/${conversationId}?page=${page}&limit=${limit}`)
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    return this.request("/messages/mark-read", {
      method: "POST",
      body: JSON.stringify({ conversationId, userId }),
    })
  }

  // Contacts
  async getContacts(params?: {
    search?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append("search", params.search)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    return this.request(`/contacts?${searchParams}`)
  }

  async getContact(id: string) {
    return this.request(`/contacts/${id}`)
  }

  async updateContact(id: string, data: any) {
    return this.request(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Users
  async getUsers() {
    return this.request("/users")
  }

  async createUser(data: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Queues
  async getQueues() {
    return this.request("/queues")
  }

  async createQueue(data: any) {
    return this.request("/queues", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // WhatsApp
  async getWhatsAppConnections() {
    return this.request("/whatsapp/connections")
  }

  async createWhatsAppConnection(data: any) {
    return this.request("/whatsapp/connections", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
