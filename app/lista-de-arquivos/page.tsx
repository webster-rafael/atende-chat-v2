import { Sidebar } from "@/components/sidebar"
import { ListaDeArquivosContent } from "@/components/lista-de-arquivos-content"

export default function ListaDeArquivosPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <ListaDeArquivosContent />
      </div>
    </div>
  )
}
