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
import { Puzzle, Edit, Trash2, MoreHorizontal, Plus, Search, TestTube, Copy, Eye, Settings } from "lucide-react"
import { toast } from "sonner"

interface Integracao {
  id: string
  nome: string
  tipo: string
  linguagem: string
  nomeProjeto: string
  jsonContent: string
  status: "Ativo" | "Inativo" | "Erro"
  criadoEm: string
  ultimaConexao: string
  totalRequests: number
}

const mockIntegracoes: Integracao[] = [
  {
    id: "8",
    nome: "Webster",
    tipo: "DialogFlow",
    linguagem: "pt-BR",
    nomeProjeto: "webster-chatbot",
    jsonContent: '{"type": "service_account", "project_id": "webster-chatbot", "private_key_id": "abc123"}',
    status: "Ativo",
    criadoEm: "2024-01-15",
    ultimaConexao: "2024-01-20",
    totalRequests: 1250,
  },
  {
    id: "9",
    nome: "Suporte Bot",
    tipo: "DialogFlow",
    linguagem: "pt-BR",
    nomeProjeto: "suporte-bot-v2",
    jsonContent: '{"type": "service_account", "project_id": "suporte-bot-v2", "private_key_id": "def456"}',
    status: "Ativo",
    criadoEm: "2024-01-10",
    ultimaConexao: "2024-01-19",
    totalRequests: 890,
  },
  {
    id: "10",
    nome: "Vendas Assistant",
    tipo: "OpenAI",
    linguagem: "pt-BR",
    nomeProjeto: "vendas-gpt",
    jsonContent: '{"api_key": "sk-...", "model": "gpt-4", "temperature": 0.7}',
    status: "Erro",
    criadoEm: "2024-01-05",
    ultimaConexao: "2024-01-18",
    totalRequests: 567,
  },
]

const tiposIntegracao = ["DialogFlow", "OpenAI", "Watson", "Rasa", "Lex", "Custom API"]
const linguagens = ["pt-BR", "en-US", "es-ES", "fr-FR", "de-DE", "it-IT"]

export function IntegracoesContent() {
  const [integracoes, setIntegracoes] = useState<Integracao[]>(mockIntegracoes)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIntegracao, setEditingIntegracao] = useState<Integracao | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    linguagem: "",
    nomeProjeto: "",
    jsonContent: "",
  })

  const filteredIntegracoes = integracoes.filter(
    (integracao) =>
      integracao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integracao.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integracao.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.tipo || !formData.linguagem || !formData.nomeProjeto) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (editingIntegracao) {
      setIntegracoes(
        integracoes.map((i) =>
          i.id === editingIntegracao.id
            ? {
                ...i,
                ...formData,
                status: "Ativo" as const,
              }
            : i,
        ),
      )
      toast.success("Integração atualizada com sucesso!")
    } else {
      const newIntegracao: Integracao = {
        id: Date.now().toString(),
        ...formData,
        status: "Ativo",
        criadoEm: new Date().toISOString().split("T")[0],
        ultimaConexao: "-",
        totalRequests: 0,
      }
      setIntegracoes([...integracoes, newIntegracao])
      toast.success("Integração criada com sucesso!")
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      tipo: "",
      linguagem: "",
      nomeProjeto: "",
      jsonContent: "",
    })
    setEditingIntegracao(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (integracao: Integracao) => {
    setEditingIntegracao(integracao)
    setFormData({
      nome: integracao.nome,
      tipo: integracao.tipo,
      linguagem: integracao.linguagem,
      nomeProjeto: integracao.nomeProjeto,
      jsonContent: integracao.jsonContent,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setIntegracoes(integracoes.filter((i) => i.id !== id))
    toast.success("Integração excluída com sucesso!")
  }

  const handleTest = (integracao: Integracao) => {
    toast.info(`Testando integração: ${integracao.nome}`)
  }

  const handleDuplicate = (integracao: Integracao) => {
    const newIntegracao: Integracao = {
      ...integracao,
      id: Date.now().toString(),
      nome: `${integracao.nome} (Cópia)`,
      criadoEm: new Date().toISOString().split("T")[0],
      ultimaConexao: "-",
      totalRequests: 0,
    }
    setIntegracoes([...integracoes, newIntegracao])
    toast.success("Integração duplicada com sucesso!")
  }

  const toggleStatus = (id: string) => {
    setIntegracoes(
      integracoes.map((i) => (i.id === id ? { ...i, status: i.status === "Ativo" ? "Inativo" : "Ativo" } : i)),
    )
    toast.success("Status da integração alterado!")
  }

  const testBot = () => {
    toast.info("Testando bot...")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Puzzle className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrações ({integracoes.length})</h1>
            <p className="text-sm text-gray-500">Gerencie suas integrações com serviços de IA e chatbots</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
              <Plus className="h-4 w-4 mr-2" />
              ADICIONAR PROJETO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIntegracao ? "Editar projeto" : "Adicionar projeto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposIntegracao.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome da integração"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Linguagem *</Label>
                  <Select
                    value={formData.linguagem}
                    onValueChange={(value) => setFormData({ ...formData, linguagem: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a linguagem" />
                    </SelectTrigger>
                    <SelectContent>
                      {linguagens.map((linguagem) => (
                        <SelectItem key={linguagem} value={linguagem}>
                          {linguagem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeProjeto">Nome do Projeto *</Label>
                  <Input
                    id="nomeProjeto"
                    value={formData.nomeProjeto}
                    onChange={(e) => setFormData({ ...formData, nomeProjeto: e.target.value })}
                    placeholder="Nome do projeto"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jsonContent">JsonContent</Label>
                <Textarea
                  id="jsonContent"
                  value={formData.jsonContent}
                  onChange={(e) => setFormData({ ...formData, jsonContent: e.target.value })}
                  placeholder="Cole aqui o JSON de configuração..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={testBot}>
                  <TestTube className="h-4 w-4 mr-2" />
                  TESTAR BOT
                </Button>
                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    CANCELAR
                  </Button>
                  <Button type="submit" className="bg-[#00183E] hover:bg-[#00183E]/90">
                    {editingIntegracao ? "ATUALIZAR" : "ADICIONAR"}
                  </Button>
                </div>
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
            placeholder="Pesquisar..."
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
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Linguagem</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Requests</TableHead>
              <TableHead>Última Conexão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIntegracoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <Puzzle className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-gray-500 font-medium">Nenhuma integração encontrada</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Tente ajustar sua pesquisa" : "Comece criando sua primeira integração"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredIntegracoes.map((integracao) => (
                <TableRow key={integracao.id}>
                  <TableCell className="font-mono">{integracao.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{integracao.nome}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{integracao.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {integracao.linguagem}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{integracao.nomeProjeto}</TableCell>
                  <TableCell>
                    <Badge
                      variant={integracao.status === "Ativo" ? "default" : "secondary"}
                      className={
                        integracao.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : integracao.status === "Erro"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {integracao.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{integracao.totalRequests.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {integracao.ultimaConexao === "-"
                      ? "-"
                      : new Date(integracao.ultimaConexao).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(integracao)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(integracao.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTest(integracao)}>
                            <TestTube className="h-4 w-4 mr-2" />
                            Testar Integração
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(integracao)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(integracao.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {integracao.status === "Ativo" ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configurações
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
