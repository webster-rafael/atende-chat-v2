"use client"

import { Sidebar } from "@/components/sidebar"
import { ConfiguracoesCampanhasContent } from "@/components/configuracoes-campanhas-content"

export default function ConfiguracoesCampanhasPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ConfiguracoesCampanhasContent />
      </main>
    </div>
  )
}
