import { Sidebar } from "@/components/sidebar"
import { UsuariosContent } from "@/components/usuarios-content"

export default function UsuariosPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <UsuariosContent />
      </main>
    </div>
  )
}
