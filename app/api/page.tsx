import { Sidebar } from "@/components/sidebar"
import { ApiContent } from "@/components/api-content"

export default function ApiPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ApiContent />
      </main>
    </div>
  )
}
