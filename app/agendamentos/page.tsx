"use client"

import { Sidebar } from "@/components/sidebar"
import { AgendamentosContent } from "@/components/agendamentos-content"

export default function AgendamentosPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AgendamentosContent />
      </main>
    </div>
  )
}
