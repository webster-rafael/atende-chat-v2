"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface FilasChatbotContentProps {
  queues: any[]
  setQueues: (queues: any[]) => void
}

export function FilasChatbotContent({ queues, setQueues }: FilasChatbotContentProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [queueToDelete, setQueueToDelete] = useState<any>(null)

  const handleDeleteQueue = (queue: any) => {
    setQueueToDelete(queue)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteQueue = () => {
    if (queueToDelete) {
      setQueues(queues.filter((q) => q.id !== queueToDelete.id))
      toast({
        title: "Fila excluída",
        description: `A fila "${queueToDelete.name}" foi excluída com sucesso.`,
      })
    }
    setDeleteConfirmOpen(false)
    setQueueToDelete(null)
  }

  return (
    <div>
      {queues.map((queue) => (
        <div key={queue.id}>
          {queue.name}
          <button onClick={() => handleDeleteQueue(queue)}>Excluir</button>
        </div>
      ))}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a fila "{queueToDelete?.name}"?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteQueue} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
