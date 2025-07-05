import { Sidebar } from "@/components/sidebar"
import { OpenAIContent } from "@/components/open-ai-content"

export default function OpenAIPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <OpenAIContent />
    </div>
  )
}
