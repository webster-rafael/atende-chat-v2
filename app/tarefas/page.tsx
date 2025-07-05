"use client"

import { Sidebar } from "@/components/sidebar"
import { TarefasContent } from "@/components/tarefas-content"

export default function TarefasPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <TarefasContent />
      </main>
    </div>
  )
}
