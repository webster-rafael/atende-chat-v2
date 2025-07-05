"use client"

import { useState } from "react"
import { Plus, Search, Calendar, CheckCircle2, Circle, Edit, Trash2, AlertCircle, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: "pessoal" | "trabalho" | "atendimento" | "vendas" | "suporte"
  assignee?: {
    name: string
    avatar?: string
  }
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  favorite: boolean
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Responder emails de clientes",
    description: "Verificar e responder todos os emails pendentes da caixa de entrada",
    completed: false,
    priority: "high",
    category: "atendimento",
    assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2025-01-08",
    createdAt: "2025-01-07T08:10:27",
    updatedAt: "2025-01-07T08:10:27",
    tags: ["Email", "Cliente"],
    favorite: true,
  },
  {
    id: "2",
    title: "Atualizar relatório mensal",
    description: "Compilar dados de vendas e atendimento do mês anterior",
    completed: false,
    priority: "medium",
    category: "trabalho",
    assignee: { name: "Webster", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2025-01-10",
    createdAt: "2025-01-06T14:30:00",
    updatedAt: "2025-01-07T09:15:00",
    tags: ["Relatório", "Vendas"],
    favorite: false,
  },
  {
    id: "3",
    title: "Configurar novo webhook",
    description: "Implementar webhook para integração com sistema externo",
    completed: true,
    priority: "urgent",
    category: "suporte",
    assignee: { name: "Webster Dev", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2025-01-07",
    createdAt: "2025-01-05T10:00:00",
    updatedAt: "2025-01-07T16:45:00",
    tags: ["Webhook", "Integração"],
    favorite: false,
  },
  {
    id: "4",
    title: "Ligar para cliente VIP",
    description: "Follow-up da proposta comercial enviada na semana passada",
    completed: false,
    priority: "high",
    category: "vendas",
    assignee: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2025-01-08",
    createdAt: "2025-01-06T11:20:00",
    updatedAt: "2025-01-06T11:20:00",
    tags: ["Cliente VIP", "Follow-up"],
    favorite: true,
  },
  {
    id: "5",
    title: "Organizar mesa de trabalho",
    description: "Limpar e organizar o ambiente de trabalho",
    completed: false,
    priority: "low",
    category: "pessoal",
    dueDate: "2025-01-09",
    createdAt: "2025-01-07T07:00:00",
    updatedAt: "2025-01-07T07:00:00",
    tags: ["Organização"],
    favorite: false,
  },
]

export function TarefasContent() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("todas")
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    category: "trabalho" as Task["category"],
    assignee: "",
    dueDate: "",
    tags: [] as string[],
  })

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      selectedFilter === "todas" ||
      (selectedFilter === "pendentes" && !task.completed) ||
      (selectedFilter === "concluidas" && task.completed) ||
      (selectedFilter === "favoritas" && task.favorite) ||
      (selectedFilter === "vencidas" && task.dueDate && new Date(task.dueDate) < new Date() && !task.completed)

    const matchesCategory = selectedCategory === "todas" || task.category === selectedCategory

    return matchesSearch && matchesFilter && matchesCategory
  })

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "atendimento":
        return "bg-blue-100 text-blue-800"
      case "vendas":
        return "bg-green-100 text-green-800"
      case "suporte":
        return "bg-purple-100 text-purple-800"
      case "trabalho":
        return "bg-gray-100 text-gray-800"
      case "pessoal":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      assignee: newTask.assignee ? { name: newTask.assignee } : undefined,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newTask.tags,
      favorite: false,
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "trabalho",
      assignee: "",
      dueDate: "",
      tags: [],
    })
    setIsAddingTask(false)
  }

  const updateTask = () => {
    if (!editingTask) return

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? { ...editingTask, updatedAt: new Date().toISOString() } : task,
    )

    setTasks(updatedTasks)
    setEditingTask(null)
  }

  const toggleTaskComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  const toggleTaskFavorite = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, favorite: !task.favorite, updatedAt: new Date().toISOString() } : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const pending = tasks.filter((t) => !t.completed).length
    const overdue = tasks.filter((t) => t.dueDate && isOverdue(t.dueDate) && !t.completed).length

    return { total, completed, pending, overdue }
  }

  const stats = getTaskStats()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Tarefas</h1>
          <p className="text-gray-600">Organize e acompanhe suas tarefas e atividades</p>
        </div>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
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
                  placeholder="Descreva a tarefa (opcional)"
                  rows={3}
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
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value: Task["category"]) => setNewTask({ ...newTask, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pessoal">Pessoal</SelectItem>
                      <SelectItem value="trabalho">Trabalho</SelectItem>
                      <SelectItem value="atendimento">Atendimento</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
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
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancelar
                </Button>
                <Button onClick={addTask} className="bg-[#00183E] hover:bg-[#00183E]/90">
                  Criar Tarefa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-8 h-8 text-[#00183E]" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total de Tarefas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Circle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-gray-600">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
                <TabsTrigger value="favoritas">Favoritas</TabsTrigger>
                <TabsTrigger value="vencidas">Vencidas</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="pessoal">Pessoal</SelectItem>
                <SelectItem value="trabalho">Trabalho</SelectItem>
                <SelectItem value="atendimento">Atendimento</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="suporte">Suporte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`transition-all hover:shadow-md ${task.completed ? "opacity-75" : ""} ${
              task.dueDate && isOverdue(task.dueDate) && !task.completed ? "border-l-4 border-l-red-500" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskComplete(task.id)}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {task.title}
                      </h3>
                      {task.favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskFavorite(task.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Star
                          className={`w-4 h-4 ${task.favorite ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                        />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingTask(task)} className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {task.description && (
                    <p className={`text-sm mb-3 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(task.category)}`}>
                        {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                      </Badge>
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {task.dueDate && (
                        <div
                          className={`flex items-center space-x-1 ${
                            isOverdue(task.dueDate) && !task.completed ? "text-red-600" : ""
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                        </div>
                      )}
                      {task.assignee && (
                        <div className="flex items-center space-x-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#00183E] text-white text-xs">
                              {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assignee.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou criar uma nova tarefa.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-priority">Prioridade</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value: Task["priority"]) => setEditingTask({ ...editingTask, priority: value })}
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
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select
                    value={editingTask.category}
                    onValueChange={(value: Task["category"]) => setEditingTask({ ...editingTask, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pessoal">Pessoal</SelectItem>
                      <SelectItem value="trabalho">Trabalho</SelectItem>
                      <SelectItem value="atendimento">Atendimento</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-assignee">Responsável</Label>
                  <Input
                    id="edit-assignee"
                    value={editingTask.assignee?.name || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        assignee: e.target.value ? { name: e.target.value } : undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editingTask.dueDate || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingTask(null)}>
                  Cancelar
                </Button>
                <Button onClick={updateTask} className="bg-[#00183E] hover:bg-[#00183E]/90">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
