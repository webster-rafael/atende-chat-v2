"use client"

import { Sidebar } from "@/components/sidebar"
import { AtendimentosContent } from "@/components/atendimentos-content"

export default function AtendimentosPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <AtendimentosContent />
      </main>
    </div>
  )
}
