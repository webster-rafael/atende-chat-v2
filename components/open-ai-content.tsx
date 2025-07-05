"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bot, Edit, Trash2, MoreHorizontal, Plus, Search, Play, Copy, Eye } from "lucide-react"
import { toast } from "sonner"

interface Prompt {
  id: string
  nome: string
  descricao: string
  prompt: string
  dadosEmpresa: string
  fila: string
  respostaIA: string
  maxTokens: number
  status: "Ativo" | "Inativo"
  criadoEm: string
  ultimoUso: string
  totalUsos: number
}

const mockPrompts: Prompt[] = [
  {
    id: "1",
    nome: "PROMPT 1",
    descricao: "Atendimento geral para suporte técnico",
    prompt: "Você é um assistente de suporte técnico especializado em resolver problemas de forma clara e objetiva.",
    dadosEmpresa: "Empresa de tecnologia focada em soluções de comunicação empresarial.",
    fila: "Fila 1",
    respostaIA: "Balanceado",
    maxTokens: 500,
    status: "Ativo",
    criadoEm: "2024-01-15",
    ultimoUso: "2024-01-20",
    totalUsos: 245,
  },
  {
    id: "2",
    nome: "Atendimento Vendas",
    descricao: "Prompt especializado para equipe de vendas",
    prompt:
      "Você é um consultor de vendas experiente, focado em entender as necessidades do cliente e oferecer soluções personalizadas.",
    dadosEmpresa: "Empresa líder em soluções de comunicação empresarial com mais de 10 anos de mercado.",
    fila: "Vendas",
    respostaIA: "Criativo",
    maxTokens: 750,
    status: "Ativo",
    criadoEm: "2024-01-10",
    ultimoUso: "2024-01-19",
    totalUsos: 189,
  },
  {
    id: "3",
    nome: "Suporte Financeiro",
    descricao: "Assistente para questões financeiras e cobrança",
    prompt:
      "Você é um assistente financeiro que ajuda clientes com questões de pagamento, faturas e planos de forma empática e profissional.",
    dadosEmpresa: "Oferecemos planos flexíveis de comunicação empresarial com diferentes modalidades de pagamento.",
    fila: "Financeiro",
    respostaIA: "Preciso",
    maxTokens: 400,
    status: "Inativo",
    criadoEm: "2024-01-05",
    ultimoUso: "2024-01-18",
    totalUsos: 67,
  },
]

const filas = ["Fila 1", "Vendas", "Suporte", "Financeiro", "Técnico", "Comercial"]

const tiposResposta = ["Balanceado", "Criativo", "Preciso", "Rápido"]

export function OpenAIContent() {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    prompt: "",
    dadosEmpresa: "",
    fila: "",
    respostaIA: "",
    maxTokens: 500,
  })

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.fila.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.prompt || !formData.fila || !formData.respostaIA) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (editingPrompt) {
      setPrompts(
        prompts.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                ...formData,
                status: "Ativo" as const,
              }
            : p,
        ),
      )
      toast.success("Prompt atualizado com sucesso!")
    } else {
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        ...formData,
        status: "Ativo",
        criadoEm: new Date().toISOString().split("T")[0],
        ultimoUso: "-",
        totalUsos: 0,
      }
      setPrompts([...prompts, newPrompt])
      toast.success("Prompt criado com sucesso!")
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      prompt: "",
      dadosEmpresa: "",
      fila: "",
      respostaIA: "",
      maxTokens: 500,
    })
    setEditingPrompt(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setFormData({
      nome: prompt.nome,
      descricao: prompt.descricao,
      prompt: prompt.prompt,
      dadosEmpresa: prompt.dadosEmpresa,
      fila: prompt.fila,
      respostaIA: prompt.respostaIA,
      maxTokens: prompt.maxTokens,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setPrompts(prompts.filter((p) => p.id !== id))
    toast.success("Prompt excluído com sucesso!")
  }

  const handleTest = (prompt: Prompt) => {
    toast.info(`Testando prompt: ${prompt.nome}`)
  }

  const handleDuplicate = (prompt: Prompt) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now().toString(),
      nome: `${prompt.nome} (Cópia)`,
      criadoEm: new Date().toISOString().split("T")[0],
      ultimoUso: "-",
      totalUsos: 0,
    }
    setPrompts([...prompts, newPrompt])
    toast.success("Prompt duplicado com sucesso!")
  }

  const toggleStatus = (id: string) => {
    setPrompts(prompts.map((p) => (p.id === id ? { ...p, status: p.status === "Ativo" ? "Inativo" : "Ativo" } : p)))
    toast.success("Status do prompt alterado!")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
            <p className="text-sm text-gray-500">Gerencie prompts de IA para suas filas de atendimento</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
              <Plus className="h-4 w-4 mr-2" />
              ADICIONAR PROMPT
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPrompt ? "Editar Prompt" : "Adicionar Prompt"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do prompt"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Máximo Tokens Resposta</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: Number.parseInt(e.target.value) })}
                    placeholder="500"
                    min="50"
                    max="2000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição de comportamento da IA</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva como a IA deve se comportar..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt de comandos da IA *</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Digite o prompt que será usado pela IA..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dadosEmpresa">Dados da empresa para pesquisa e geração de respostas da IA</Label>
                <Textarea
                  id="dadosEmpresa"
                  value={formData.dadosEmpresa}
                  onChange={(e) => setFormData({ ...formData, dadosEmpresa: e.target.value })}
                  placeholder="Informações sobre a empresa que a IA pode usar..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Filas *</Label>
                  <Select value={formData.fila} onValueChange={(value) => setFormData({ ...formData, fila: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fila" />
                    </SelectTrigger>
                    <SelectContent>
                      {filas.map((fila) => (
                        <SelectItem key={fila} value={fila}>
                          {fila}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Resposta da IA *</Label>
                  <Select
                    value={formData.respostaIA}
                    onValueChange={(value) => setFormData({ ...formData, respostaIA: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de resposta" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposResposta.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  CANCELAR
                </Button>
                <Button type="submit" className="bg-[#00183E] hover:bg-[#00183E]/90">
                  {editingPrompt ? "ATUALIZAR" : "ADICIONAR"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Setor/Fila</TableHead>
              <TableHead>Máximo Tokens Resposta</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo Resposta</TableHead>
              <TableHead>Total Usos</TableHead>
              <TableHead>Último Uso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <Bot className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-gray-500 font-medium">Nenhum prompt encontrado</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Tente ajustar sua pesquisa" : "Comece criando seu primeiro prompt de IA"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{prompt.nome}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{prompt.descricao}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {prompt.fila}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{prompt.maxTokens}</TableCell>
                  <TableCell>
                    <Badge
                      variant={prompt.status === "Ativo" ? "default" : "secondary"}
                      className={
                        prompt.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {prompt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {prompt.respostaIA}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{prompt.totalUsos.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {prompt.ultimoUso === "-" ? "-" : new Date(prompt.ultimoUso).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleTest(prompt)} className="h-8 w-8 p-0">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(prompt)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTest(prompt)}>
                            <Play className="h-4 w-4 mr-2" />
                            Testar Prompt
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(prompt)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(prompt.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {prompt.status === "Ativo" ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(prompt.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
