"use client"

import { Sidebar } from "@/components/sidebar"
import { AjudaContent } from "@/components/ajuda-content"

export default function AjudaPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AjudaContent />
      </main>
    </div>
  )
}
