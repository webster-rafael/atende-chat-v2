"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Plus, MoreHorizontal, Calendar, Flag, MessageSquare, Phone, Tag } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description?: string
  assignee?: {
    name: string
    avatar?: string
  }
  priority: "low" | "medium" | "high" | "urgent"
  type: "atendimento" | "bug" | "feature" | "suporte"
  contact?: {
    name: string
    phone: string
  }
  dueDate?: string
  tags: string[]
  createdAt: string
}

interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

const initialData: Column[] = [
  {
    id: "atendimento",
    title: "ATENDIMENTO",
    color: "bg-blue-100 border-blue-300",
    tasks: [
      {
        id: "task-1",
        title: "Dúvida sobre produto - João Silva",
        description: "Cliente solicitando informações sobre especificações do produto XYZ",
        assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "high",
        type: "atendimento",
        contact: { name: "João Silva", phone: "5567991537644" },
        dueDate: "2025-01-08",
        tags: ["WhatsApp", "Produto"],
        createdAt: "2025-01-07",
      },
      {
        id: "task-2",
        title: "Reclamação - Ana Costa",
        description: "Cliente insatisfeita com tempo de entrega do pedido",
        assignee: { name: "Webster", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "urgent",
        type: "atendimento",
        contact: { name: "Ana Costa", phone: "5567998123456" },
        dueDate: "2025-01-07",
        tags: ["Reclamação", "Entrega"],
        createdAt: "2025-01-06",
      },
      {
        id: "task-3",
        title: "Informações gerais - Pedro Lima",
        description: "Cliente perguntando sobre horário de funcionamento",
        assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "medium",
        type: "atendimento",
        contact: { name: "Pedro Lima", phone: "5567940123456" },
        dueDate: "2025-01-08",
        tags: ["Informações", "Horário"],
        createdAt: "2025-01-07",
      },
    ],
  },
  {
    id: "suporte",
    title: "SUPORTE",
    color: "bg-purple-100 border-purple-300",
    tasks: [
      {
        id: "task-4",
        title: "Problema técnico - Maria Santos",
        description: "Cliente não consegue acessar o portal do cliente",
        assignee: { name: "Webster Dev", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "high",
        type: "suporte",
        contact: { name: "Maria Santos", phone: "5567929445756" },
        dueDate: "2025-01-08",
        tags: ["Técnico", "Portal"],
        createdAt: "2025-01-07",
      },
      {
        id: "task-5",
        title: "Configuração webhook - Empresa ABC",
        description: "Auxiliar cliente na configuração de webhook para integração",
        assignee: { name: "Webster Dev", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "medium",
        type: "suporte",
        contact: { name: "Roberto Silva", phone: "5567930313571" },
        dueDate: "2025-01-10",
        tags: ["Webhook", "Integração"],
        createdAt: "2025-01-05",
      },
    ],
  },
  {
    id: "vendas",
    title: "VENDAS",
    color: "bg-green-100 border-green-300",
    tasks: [
      {
        id: "task-6",
        title: "Proposta comercial - Carlos Oliveira",
        description: "Cliente interessado em plano empresarial premium",
        assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "high",
        type: "feature",
        contact: { name: "Carlos Oliveira", phone: "5567998765432" },
        dueDate: "2025-01-09",
        tags: ["Proposta", "Premium"],
        createdAt: "2025-01-06",
      },
      {
        id: "task-7",
        title: "Follow-up - Fernanda Oliveira",
        description: "Acompanhar interesse em upgrade de plano",
        assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "medium",
        type: "feature",
        contact: { name: "Fernanda Oliveira", phone: "5567967790175" },
        dueDate: "2025-01-12",
        tags: ["Follow-up", "Upgrade"],
        createdAt: "2025-01-04",
      },
      {
        id: "task-8",
        title: "Demonstração - Marcos Pereira",
        description: "Agendar demonstração do sistema para cliente potencial",
        assignee: { name: "Webster", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "high",
        type: "feature",
        contact: { name: "Marcos Pereira", phone: "5512036318460" },
        dueDate: "2025-01-08",
        tags: ["Demo", "Agendamento"],
        createdAt: "2025-01-07",
      },
    ],
  },
  {
    id: "aguardando",
    title: "AGUARDANDO",
    color: "bg-yellow-100 border-yellow-300",
    tasks: [
      {
        id: "task-9",
        title: "Aguardando documentos - Lucia Santos",
        description: "Cliente precisa enviar documentos para prosseguir com contratação",
        assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "medium",
        type: "feature",
        contact: { name: "Lucia Santos", phone: "5567930313571" },
        dueDate: "2025-01-15",
        tags: ["Documentos", "Contratação"],
        createdAt: "2025-01-03",
      },
      {
        id: "task-10",
        title: "Resposta do cliente - Leo",
        description: "Aguardando retorno sobre proposta enviada",
        assignee: { name: "Webster", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "low",
        type: "feature",
        contact: { name: "Leo", phone: "5567999888777" },
        dueDate: "2025-01-20",
        tags: ["Proposta", "Retorno"],
        createdAt: "2025-01-05",
      },
    ],
  },
  {
    id: "finalizado",
    title: "FINALIZADO",
    color: "bg-gray-100 border-gray-300",
    tasks: [
      {
        id: "task-11",
        title: "Venda concluída - Daniel Gomes",
        description: "Cliente assinou contrato do plano empresarial",
        assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "low",
        type: "feature",
        contact: { name: "Daniel Gomes", phone: "5567991537644" },
        dueDate: "2025-01-05",
        tags: ["Venda", "Contrato"],
        createdAt: "2025-01-02",
      },
      {
        id: "task-12",
        title: "Suporte resolvido - Patricia Silva",
        description: "Problema técnico solucionado com sucesso",
        assignee: { name: "Webster Dev", avatar: "/placeholder.svg?height=32&width=32" },
        priority: "low",
        type: "suporte",
        contact: { name: "Patricia Silva", phone: "5567939445756" },
        dueDate: "2025-01-06",
        tags: ["Resolvido", "Técnico"],
        createdAt: "2025-01-05",
      },
    ],
  },
]

const getKanbanColumns = () => {
  // This would normally come from a shared state or API
  // For now, we'll simulate the integration with tags
  const kanbanTags = [
    { id: "atendimento", title: "ATENDIMENTO", color: "bg-blue-100 border-blue-300" },
    { id: "suporte", title: "SUPORTE", color: "bg-purple-100 border-purple-300" },
    { id: "vendas", title: "VENDAS", color: "bg-green-100 border-green-300" },
    { id: "sdr", title: "SDR", color: "bg-orange-100 border-orange-300" },
    { id: "aguardando", title: "AGUARDANDO", color: "bg-yellow-100 border-yellow-300" },
    { id: "finalizado", title: "FINALIZADO", color: "bg-gray-100 border-gray-300" },
  ]

  return kanbanTags.map((tag) => ({
    ...tag,
    tasks: initialData.find((col) => col.id === tag.id)?.tasks || [],
  }))
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(getKanbanColumns())
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    type: "atendimento" as Task["type"],
    assignee: "",
    dueDate: "",
  })

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const sourceTask = sourceColumn.tasks.find((task) => task.id === draggableId)
    if (!sourceTask) return

    const newColumns = columns.map((column) => {
      if (column.id === source.droppableId) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== draggableId),
        }
      }
      if (column.id === destination.droppableId) {
        const newTasks = [...column.tasks]
        newTasks.splice(destination.index, 0, sourceTask)
        return {
          ...column,
          tasks: newTasks,
        }
      }
      return column
    })

    setColumns(newColumns)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "atendimento":
        return <MessageSquare className="w-4 h-4" />
      case "bug":
        return <Flag className="w-4 h-4" />
      case "suporte":
        return <Phone className="w-4 h-4" />
      default:
        return <Tag className="w-4 h-4" />
    }
  }

  const addTask = (columnId: string) => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      type: newTask.type,
      assignee: newTask.assignee ? { name: newTask.assignee } : undefined,
      dueDate: newTask.dueDate,
      tags: [],
      createdAt: new Date().toISOString().split("T")[0],
    }

    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        }
      }
      return column
    })

    setColumns(newColumns)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      type: "atendimento",
      assignee: "",
      dueDate: "",
    })
    setIsAddingTask(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kanban - Gestão de Tarefas</h1>
            <p className="text-gray-600">Organize e acompanhe o progresso das suas tarefas e atendimentos</p>
          </div>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Digite o título da tarefa"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Descreva a tarefa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newTask.type}
                      onValueChange={(value: Task["type"]) => setNewTask({ ...newTask, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atendimento">Atendimento</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignee">Responsável</Label>
                    <Input
                      id="assignee"
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Data de Vencimento</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={() => addTask("atendimento")} className="w-full bg-[#00183E] hover:bg-[#00183E]/90">
                  Criar Tarefa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 min-w-max">
            {columns.map((column) => (
              <div key={column.id} className="w-80 flex-shrink-0">
                <div className={`rounded-lg border-2 ${column.color} h-full flex flex-col`}>
                  {/* Column Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <Badge variant="secondary" className="bg-[#00183E] text-white">
                        {column.tasks.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Tasks */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-4 space-y-3 min-h-[200px] ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
                                  snapshot.isDragging ? "shadow-lg rotate-2" : ""
                                }`}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2">
                                      {getTypeIcon(task.type)}
                                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{task.title}</h4>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  {task.description && (
                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                                  )}

                                  {task.contact && (
                                    <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded">
                                      <Phone className="w-3 h-3 text-gray-500" />
                                      <div className="text-xs">
                                        <p className="font-medium">{task.contact.name}</p>
                                        <p className="text-gray-500">{task.contact.phone}</p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between mb-3">
                                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                      {task.priority.toUpperCase()}
                                    </Badge>
                                    {task.dueDate && (
                                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                                      </div>
                                    )}
                                  </div>

                                  {task.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {task.tags.map((tag, tagIndex) => (
                                        <Badge key={tagIndex} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                  {task.assignee && (
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-[#00183E] text-white text-xs">
                                          {task.assignee.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs text-gray-600">{task.assignee.name}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
