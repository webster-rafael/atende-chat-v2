import { Sidebar } from "@/components/sidebar"
import { ConfiguracoesContent } from "@/components/configuracoes-content"

export default function ConfiguracoesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ConfiguracoesContent />
      </main>
    </div>
  )
}
