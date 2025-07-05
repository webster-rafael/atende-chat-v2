import { Sidebar } from "@/components/sidebar"
import FilasChatbotContent from "@/components/filas-chatbot-content"

export default function FilasChatbotPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <FilasChatbotContent />
          </div>
        </main>
      </div>
    </div>
  )
}
