import { Sidebar } from "@/components/sidebar"
import { ConexoesContent } from "@/components/conexoes-content"

export default function ConexoesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <ConexoesContent />
      </div>
    </div>
  )
}
