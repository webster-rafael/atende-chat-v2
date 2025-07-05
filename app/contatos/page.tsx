"use client"

import { Sidebar } from "@/components/sidebar"
import { ContatosContent } from "@/components/contatos-content"

export default function ContatosPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ContatosContent />
      </main>
    </div>
  )
}
