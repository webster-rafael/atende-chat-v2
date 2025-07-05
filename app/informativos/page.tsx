"use client"

import { Sidebar } from "@/components/sidebar"
import { InformativosContent } from "@/components/informativos-content"

export default function InformativosPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <InformativosContent />
      </main>
    </div>
  )
}
