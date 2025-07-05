"use client"

import { useState } from "react"
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MessageSquare,
  Phone,
  Bell,
  FileText,
  Edit,
  Trash2,
  Search,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

interface Appointment {
  id: string
  title: string
  description?: string
  contact: {
    id: string
    name: string
    phone: string
    avatar?: string
  }
  date: string
  time: string
  duration: number // em minutos
  type: "call" | "meeting" | "message" | "demo" | "follow-up"
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show"
  priority: "low" | "medium" | "high" | "urgent"
  reminder: boolean
  reminderTime: number // minutos antes
  notes?: string
  createdAt: string
  updatedAt: string
}

const initialAppointments: Appointment[] = [
  {
    id: "1",
    title: "Demonstração do Sistema",
    description: "Apresentar funcionalidades do WhatsApp ERP para cliente potencial",
    contact: {
      id: "1",
      name: "João Silva",
      phone: "5567991352504",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2025-01-08",
    time: "14:00",
    duration: 60,
    type: "demo",
    status: "scheduled",
    priority: "high",
    reminder: true,
    reminderTime: 30,
    notes: "Cliente interessado no plano empresarial",
    createdAt: "2025-01-07",
    updatedAt: "2025-01-07",
  },
  {
    id: "2",
    title: "Follow-up Proposta Comercial",
    description: "Acompanhar interesse na proposta enviada",
    contact: {
      id: "2",
      name: "Maria Santos",
      phone: "5567993372205",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2025-01-09",
    time: "10:30",
    duration: 30,
    type: "follow-up",
    status: "confirmed",
    priority: "medium",
    reminder: true,
    reminderTime: 15,
    notes: "Enviar material adicional antes da ligação",
    createdAt: "2025-01-06",
    updatedAt: "2025-01-07",
  },
  {
    id: "3",
    title: "Suporte Técnico - Configuração",
    description: "Auxiliar na configuração do webhook",
    contact: {
      id: "3",
      name: "Carlos Oliveira",
      phone: "5567998765432",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2025-01-10",
    time: "16:00",
    duration: 45,
    type: "call",
    status: "scheduled",
    priority: "urgent",
    reminder: true,
    reminderTime: 60,
    notes: "Preparar documentação técnica",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-06",
  },
]

const availableVariables = [
  { key: "{{primeiro_nome}}", label: "Primeiro Nome" },
  { key: "{{nome}}", label: "Nome" },
  { key: "{{saudacao}}", label: "Saudação" },
  { key: "{{protocolo}}", label: "Protocolo" },
  { key: "{{hora}}", label: "Hora" },
  { key: "{{data}}", label: "Data" },
  { key: "{{empresa}}", label: "Empresa" },
  { key: "{{agente}}", label: "Agente" },
]

export function AgendamentosContent() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [isAddingAppointment, setIsAddingAppointment] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month")
  const [searchTerm, setSearchTerm] = useState("")
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    description: "",
    contactId: "",
    date: "",
    time: "",
    duration: 30,
    type: "meeting" as Appointment["type"],
    priority: "medium" as Appointment["priority"],
    reminder: true,
    reminderTime: 30,
    notes: "",
    message: "",
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="w-4 h-4" />
      case "meeting":
        return <User className="w-4 h-4" />
      case "message":
        return <MessageSquare className="w-4 h-4" />
      case "demo":
        return <FileText className="w-4 h-4" />
      case "follow-up":
        return <Bell className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500"
      case "high":
        return "border-l-orange-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const addAppointment = () => {
    if (!newAppointment.title.trim() || !newAppointment.date || !newAppointment.time) return

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newAppointment.title,
      description: newAppointment.description,
      contact: {
        id: newAppointment.contactId,
        name: "Cliente Selecionado", // Seria buscado da lista de contatos
        phone: "5567999999999",
      },
      date: newAppointment.date,
      time: newAppointment.time,
      duration: newAppointment.duration,
      type: newAppointment.type,
      status: "scheduled",
      priority: newAppointment.priority,
      reminder: newAppointment.reminder,
      reminderTime: newAppointment.reminderTime,
      notes: newAppointment.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setAppointments([appointment, ...appointments])
    setNewAppointment({
      title: "",
      description: "",
      contactId: "",
      date: "",
      time: "",
      duration: 30,
      type: "meeting",
      priority: "medium",
      reminder: true,
      reminderTime: 30,
      notes: "",
      message: "",
    })
    setIsAddingAppointment(false)
  }

  const updateAppointment = () => {
    if (!editingAppointment) return

    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === editingAppointment.id
        ? { ...editingAppointment, updatedAt: new Date().toISOString().split("T")[0] }
        : appointment,
    )

    setAppointments(updatedAppointments)
    setEditingAppointment(null)
  }

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id))
  }

  const insertVariable = (variable: string) => {
    setNewAppointment({
      ...newAppointment,
      message: newAppointment.message + variable,
    })
  }

  const getAppointmentStats = () => {
    const total = appointments.length
    const today = new Date().toISOString().split("T")[0]
    const todayAppointments = appointments.filter((a) => a.date === today).length
    const confirmed = appointments.filter((a) => a.status === "confirmed").length
    const pending = appointments.filter((a) => a.status === "scheduled").length

    return { total, todayAppointments, confirmed, pending }
  }

  const stats = getAppointmentStats()

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDay = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dayAppointments = appointments.filter((apt) => apt.date === currentDay.toISOString().split("T")[0])

      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        appointments: dayAppointments,
      })

      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos ({appointments.length})</h1>
          <p className="text-gray-600">Gerencie seus compromissos e reuniões</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isAddingAppointment} onOpenChange={setIsAddingAppointment}>
            <DialogTrigger asChild>
              <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Agendamento</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Agendamento *</Label>
                    <Input
                      id="title"
                      value={newAppointment.title}
                      onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                      placeholder="Ex: Reunião com cliente"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact">Contato *</Label>
                    <Select
                      value={newAppointment.contactId}
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, contactId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um contato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">João Silva - 5567991352504</SelectItem>
                        <SelectItem value="2">Maria Santos - 5567993372205</SelectItem>
                        <SelectItem value="3">Carlos Oliveira - 5567998765432</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duração (min)</Label>
                      <Select
                        value={newAppointment.duration.toString()}
                        onValueChange={(value) =>
                          setNewAppointment({ ...newAppointment, duration: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="90">1h 30min</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={newAppointment.type}
                        onValueChange={(value: Appointment["type"]) =>
                          setNewAppointment({ ...newAppointment, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Reunião</SelectItem>
                          <SelectItem value="call">Ligação</SelectItem>
                          <SelectItem value="demo">Demonstração</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="message">Mensagem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select
                        value={newAppointment.priority}
                        onValueChange={(value: Appointment["priority"]) =>
                          setNewAppointment({ ...newAppointment, priority: value })
                        }
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
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newAppointment.description}
                      onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                      placeholder="Descreva o objetivo do agendamento"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem para o Cliente</Label>
                    <Textarea
                      id="message"
                      value={newAppointment.message}
                      onChange={(e) => setNewAppointment({ ...newAppointment, message: e.target.value })}
                      placeholder="Mensagem que será enviada ao cliente"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reminder"
                        checked={newAppointment.reminder}
                        onCheckedChange={(checked) => setNewAppointment({ ...newAppointment, reminder: !!checked })}
                      />
                      <Label htmlFor="reminder">Enviar lembrete</Label>
                    </div>
                    {newAppointment.reminder && (
                      <div>
                        <Label htmlFor="reminderTime">Lembrar com antecedência</Label>
                        <Select
                          value={newAppointment.reminderTime.toString()}
                          onValueChange={(value) =>
                            setNewAppointment({ ...newAppointment, reminderTime: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutos</SelectItem>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="120">2 horas</SelectItem>
                            <SelectItem value="1440">1 dia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações Internas</Label>
                    <Textarea
                      id="notes"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                      placeholder="Notas internas sobre o agendamento"
                      rows={2}
                    />
                  </div>
                </div>

                <div>
                  <Label>Variáveis Disponíveis</Label>
                  <div className="mt-2 space-y-2 max-h-80 overflow-y-auto">
                    {availableVariables.map((variable) => (
                      <div
                        key={variable.key}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => insertVariable(variable.key)}
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {variable.key}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-medium mt-1">{variable.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">Anexar Arquivo</Button>
                <Button variant="outline" onClick={() => setIsAddingAppointment(false)}>
                  Cancelar
                </Button>
                <Button onClick={addAppointment} className="bg-[#00183E] hover:bg-[#00183E]/90">
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-[#00183E]" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total de Agendamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
                <p className="text-sm text-gray-600">Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-sm text-gray-600">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={goToToday}>
                Hoje
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <h2 className="text-lg font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="month">Mês</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Calendar Grid */}
          {viewMode === "month" && (
            <div className="grid grid-cols-7 gap-1">
              {/* Week Headers */}
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-100 ${
                    !day.isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"
                  } ${day.date.toDateString() === new Date().toDateString() ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
                  <div className="space-y-1">
                    {day.appointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded border-l-2 ${getPriorityColor(apt.priority)} bg-gray-50 cursor-pointer hover:bg-gray-100`}
                        onClick={() => setEditingAppointment(apt)}
                      >
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(apt.type)}
                          <span className="truncate">{apt.time}</span>
                        </div>
                        <div className="truncate font-medium">{apt.title}</div>
                      </div>
                    ))}
                    {day.appointments.length > 2 && (
                      <div className="text-xs text-gray-500">+{day.appointments.length - 2} mais</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agenda View */}
          {viewMode === "agenda" && (
            <div className="space-y-3">
              {appointments
                .filter(
                  (apt) =>
                    apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    apt.contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((appointment) => (
                  <Card key={appointment.id} className={`border-l-4 ${getPriorityColor(appointment.priority)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-[#00183E] text-white rounded-lg">
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(appointment.date).toLocaleDateString("pt-BR")}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {appointment.time} ({appointment.duration}min)
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{appointment.contact.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status === "scheduled"
                              ? "Agendado"
                              : appointment.status === "confirmed"
                                ? "Confirmado"
                                : appointment.status === "completed"
                                  ? "Concluído"
                                  : appointment.status === "cancelled"
                                    ? "Cancelado"
                                    : "Não compareceu"}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => setEditingAppointment(appointment)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAppointment(appointment.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          {editingAppointment && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editingAppointment.title}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Data</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Horário</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editingAppointment.time}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingAppointment.status}
                  onValueChange={(value: Appointment["status"]) =>
                    setEditingAppointment({ ...editingAppointment, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="no-show">Não compareceu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea
                  id="edit-notes"
                  value={editingAppointment.notes || ""}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                  Cancelar
                </Button>
                <Button onClick={updateAppointment} className="bg-[#00183E] hover:bg-[#00183E]/90">
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
