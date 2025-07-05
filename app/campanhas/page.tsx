"use client"

import { Sidebar } from "@/components/sidebar"
import { CampanhasContent } from "@/components/campanhas-content"

export default function CampanhasPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <CampanhasContent />
      </main>
    </div>
  )
}
