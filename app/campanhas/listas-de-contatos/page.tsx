"use client"

import { Sidebar } from "@/components/sidebar"
import { ListasDeContatosContent } from "@/components/listas-de-contatos-content"

export default function ListasDeContatosPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ListasDeContatosContent />
      </main>
    </div>
  )
}
