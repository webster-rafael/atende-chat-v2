"use client"

import { Sidebar } from "@/components/sidebar"
import { InformativosCampanhasContent } from "@/components/informativos-campanhas-content"

export default function InformativosCampanhasPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <InformativosCampanhasContent />
      </main>
    </div>
  )
}
