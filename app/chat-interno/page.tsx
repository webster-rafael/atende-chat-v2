"use client"

import { Sidebar } from "@/components/sidebar"
import { ChatInternoContent } from "@/components/chat-interno-content"

export default function ChatInternoPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ChatInternoContent />
      </main>
    </div>
  )
}
