"use client"

import { Sidebar } from "@/components/sidebar"
import { KanbanBoard } from "@/components/kanban-board"

export default function KanbanPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  )
}
