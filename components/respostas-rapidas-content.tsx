"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Copy, Tag, Clock, User, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface QuickResponse {
  id: string
  shortcut: string
  title: string
  message: string
  category: "atendimento" | "vendas" | "suporte" | "geral"
  createdAt: string
  updatedAt: string
  usageCount: number
}

const initialResponses: QuickResponse[] = [
  {
    id: "1",
    shortcut: "/ola",
    title: "Saudação Inicial",
    message: "Olá {{primeiro_nome}}! 👋\n\nSou {{agente}} da equipe {{empresa}}. Como posso ajudá-lo hoje?",
    category: "atendimento",
    createdAt: "2025-01-07",
    updatedAt: "2025-01-07",
    usageCount: 45,
  },
  {
    id: "2",
    shortcut: "/horario",
    title: "Horário de Funcionamento",
    message:
      "Nosso horário de atendimento é:\n\n📅 Segunda a Sexta: 8h às 18h\n📅 Sábado: 8h às 12h\n📅 Domingo: Fechado\n\nFora desse horário, responderemos assim que possível!",
    category: "geral",
    createdAt: "2025-01-06",
    updatedAt: "2025-01-07",
    usageCount: 32,
  },
  {
    id: "3",
    shortcut: "/produto",
    title: "Informações do Produto",
    message:
      "Ficou interessado em nossos produtos? 🛍️\n\nTemos várias opções disponíveis! Posso enviar nosso catálogo completo com preços atualizados.\n\nQual categoria te interessa mais?",
    category: "vendas",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-06",
    usageCount: 28,
  },
  {
    id: "4",
    shortcut: "/suporte",
    title: "Suporte Técnico",
    message:
      "Entendi que você está com dificuldades técnicas. 🔧\n\nPara te ajudar melhor, preciso de algumas informações:\n\n1. Qual o problema específico?\n2. Quando começou a acontecer?\n3. Você já tentou alguma solução?\n\nProtocolo: {{protocolo}}",
    category: "suporte",
    createdAt: "2025-01-04",
    updatedAt: "2025-01-05",
    usageCount: 19,
  },
  {
    id: "5",
    shortcut: "/obrigado",
    title: "Agradecimento",
    message:
      "Muito obrigado pelo contato, {{primeiro_nome}}! 😊\n\nFoi um prazer ajudá-lo hoje. Se precisar de mais alguma coisa, estarei aqui!\n\nTenha um ótimo dia! ✨",
    category: "atendimento",
    createdAt: "2025-01-03",
    updatedAt: "2025-01-04",
    usageCount: 67,
  },
]

const availableVariables = [
  { key: "{{primeiro_nome}}", label: "Primeiro Nome", description: "Nome do cliente" },
  { key: "{{nome}}", label: "Nome Completo", description: "Nome completo do cliente" },
  { key: "{{empresa}}", label: "Empresa", description: "Nome da sua empresa" },
  { key: "{{agente}}", label: "Agente", description: "Nome do atendente" },
  { key: "{{protocolo}}", label: "Protocolo", description: "Número do protocolo" },
  { key: "{{hora}}", label: "Hora Atual", description: "Hora atual do sistema" },
  { key: "{{data}}", label: "Data Atual", description: "Data atual do sistema" },
  { key: "{{saudacao}}", label: "Saudação", description: "Saudação baseada no horário" },
]

export function RespostasRapidasContent() {
  const [responses, setResponses] = useState<QuickResponse[]>(initialResponses)
  const [isAddingResponse, setIsAddingResponse] = useState(false)
  const [editingResponse, setEditingResponse] = useState<QuickResponse | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [newResponse, setNewResponse] = useState({
    shortcut: "",
    title: "",
    message: "",
    category: "atendimento" as QuickResponse["category"],
  })

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.shortcut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "todas" || response.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "atendimento":
        return "bg-blue-100 text-blue-800"
      case "vendas":
        return "bg-green-100 text-green-800"
      case "suporte":
        return "bg-purple-100 text-purple-800"
      case "geral":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "atendimento":
        return <MessageSquare className="w-4 h-4" />
      case "vendas":
        return <Tag className="w-4 h-4" />
      case "suporte":
        return <User className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const addResponse = () => {
    if (!newResponse.shortcut.trim() || !newResponse.title.trim() || !newResponse.message.trim()) return

    const response: QuickResponse = {
      id: Date.now().toString(),
      shortcut: newResponse.shortcut.startsWith("/") ? newResponse.shortcut : `/${newResponse.shortcut}`,
      title: newResponse.title,
      message: newResponse.message,
      category: newResponse.category,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      usageCount: 0,
    }

    setResponses([...responses, response])
    setNewResponse({
      shortcut: "",
      title: "",
      message: "",
      category: "atendimento",
    })
    setIsAddingResponse(false)
  }

  const updateResponse = () => {
    if (!editingResponse) return

    const updatedResponses = responses.map((response) =>
      response.id === editingResponse.id
        ? { ...editingResponse, updatedAt: new Date().toISOString().split("T")[0] }
        : response,
    )

    setResponses(updatedResponses)
    setEditingResponse(null)
  }

  const deleteResponse = (id: string) => {
    setResponses(responses.filter((response) => response.id !== id))
  }

  const insertVariable = (variable: string, isEditing = false) => {
    if (isEditing && editingResponse) {
      setEditingResponse({
        ...editingResponse,
        message: editingResponse.message + variable,
      })
    } else {
      setNewResponse({
        ...newResponse,
        message: newResponse.message + variable,
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Respostas Rápidas</h1>
          <p className="text-gray-600">Gerencie templates de mensagens para agilizar o atendimento</p>
        </div>
        <Dialog open={isAddingResponse} onOpenChange={setIsAddingResponse}>
          <DialogTrigger asChild>
            <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Resposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Resposta Rápida</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shortcut">Atalho</Label>
                    <Input
                      id="shortcut"
                      value={newResponse.shortcut}
                      onChange={(e) => setNewResponse({ ...newResponse, shortcut: e.target.value })}
                      placeholder="/exemplo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={newResponse.category}
                      onValueChange={(value: QuickResponse["category"]) =>
                        setNewResponse({ ...newResponse, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atendimento">Atendimento</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                        <SelectItem value="geral">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newResponse.title}
                    onChange={(e) => setNewResponse({ ...newResponse, title: e.target.value })}
                    placeholder="Nome da resposta rápida"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={newResponse.message}
                    onChange={(e) => setNewResponse({ ...newResponse, message: e.target.value })}
                    placeholder="Digite sua mensagem aqui..."
                    rows={8}
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
                      <p className="text-xs text-gray-500">{variable.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAddingResponse(false)}>
                Cancelar
              </Button>
              <Button onClick={addResponse} className="bg-[#00183E] hover:bg-[#00183E]/90">
                Criar Resposta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-8 h-8 text-[#00183E]" />
              <div>
                <p className="text-2xl font-bold">{responses.length}</p>
                <p className="text-sm text-gray-600">Total de Respostas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{responses.filter((r) => r.category === "vendas").length}</p>
                <p className="text-sm text-gray-600">Vendas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{responses.filter((r) => r.category === "suporte").length}</p>
                <p className="text-sm text-gray-600">Suporte</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{responses.reduce((acc, r) => acc + r.usageCount, 0)}</p>
                <p className="text-sm text-gray-600">Usos Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar respostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="atendimento">Atendimento</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="suporte">Suporte</SelectItem>
                <SelectItem value="geral">Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Responses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Rápidas ({filteredResponses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atalho</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {response.shortcut}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{response.title}</TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryColor(response.category)} flex items-center space-x-1 w-fit`}>
                      {getCategoryIcon(response.category)}
                      <span className="capitalize">{response.category}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{response.usageCount}</TableCell>
                  <TableCell>{new Date(response.updatedAt).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(response.message)}
                        title="Copiar mensagem"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingResponse(response)} title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteResponse(response.id)}
                        title="Excluir"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingResponse} onOpenChange={() => setEditingResponse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Resposta Rápida</DialogTitle>
          </DialogHeader>
          {editingResponse && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-shortcut">Atalho</Label>
                    <Input
                      id="edit-shortcut"
                      value={editingResponse.shortcut}
                      onChange={(e) => setEditingResponse({ ...editingResponse, shortcut: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Categoria</Label>
                    <Select
                      value={editingResponse.category}
                      onValueChange={(value: QuickResponse["category"]) =>
                        setEditingResponse({ ...editingResponse, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atendimento">Atendimento</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                        <SelectItem value="geral">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    value={editingResponse.title}
                    onChange={(e) => setEditingResponse({ ...editingResponse, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-message">Mensagem</Label>
                  <Textarea
                    id="edit-message"
                    value={editingResponse.message}
                    onChange={(e) => setEditingResponse({ ...editingResponse, message: e.target.value })}
                    rows={8}
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
                      onClick={() => insertVariable(variable.key, true)}
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
                      <p className="text-xs text-gray-500">{variable.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditingResponse(null)}>
              Cancelar
            </Button>
            <Button onClick={updateResponse} className="bg-[#00183E] hover:bg-[#00183E]/90">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
