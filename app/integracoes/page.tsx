import { Sidebar } from "@/components/sidebar"
import { IntegracoesContent } from "@/components/integracoes-content"

export default function IntegracoesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <IntegracoesContent />
    </div>
  )
}
