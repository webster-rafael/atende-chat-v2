"use client"

import { Sidebar } from "@/components/sidebar"
import { RespostasRapidasContent } from "@/components/respostas-rapidas-content"

export default function RespostasRapidasPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <RespostasRapidasContent />
      </main>
    </div>
  )
}
