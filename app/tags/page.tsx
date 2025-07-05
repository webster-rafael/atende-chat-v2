"use client"

import { Sidebar } from "@/components/sidebar"
import { TagsContent } from "@/components/tags-content"

export default function TagsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <TagsContent />
      </main>
    </div>
  )
}
