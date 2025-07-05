"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Smartphone,
  CheckCircle,
  XCircle,
  QrCode,
  Loader2,
  Settings,
  Copy,
  Power,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"

interface Conexao {
  id: string
  nome: string
  status: "conectado" | "desconectado" | "conectando" | "erro"
  sessao: string
  ultimaAtualizacao: string
  padrao: boolean
  mensagemSaudacao: string
  mensagemConclusao: string
  mensagemForaExpediente: string
  mensagemAvaliacao: string
  token: string
  fila: string
  prompt: string
  transferirApos: number
  filaTransferencia: string
  encerrarApos: number
  mensagemEncerramento: string
}

export function ConexoesContent() {
  const [conexoes, setConexoes] = useState<Conexao[]>([
    {
      id: "1",
      nome: "Webster",
      status: "conectado",
      sessao: "DESCONECTAR",
      ultimaAtualizacao: "04/07/25 08:06",
      padrao: true,
      mensagemSaudacao: "Olá! Como posso ajudá-lo hoje?",
      mensagemConclusao: "Obrigado pelo contato! Tenha um ótimo dia!",
      mensagemForaExpediente: "No momento estamos fora do horário de atendimento.",
      mensagemAvaliacao: "Por favor, avalie nosso atendimento de 1 a 5.",
      token: "whatsapp_token_123",
      fila: "Suporte",
      prompt: "Atendimento Padrão",
      transferirApos: 5,
      filaTransferencia: "Supervisor",
      encerrarApos: 30,
      mensagemEncerramento: "Chat encerrado por inatividade.",
    },
    {
      id: "2",
      nome: "webster22",
      status: "conectando",
      sessao: "QR CODE",
      ultimaAtualizacao: "04/07/25 09:42",
      padrao: false,
      mensagemSaudacao: "",
      mensagemConclusao: "",
      mensagemForaExpediente: "",
      mensagemAvaliacao: "",
      token: "",
      fila: "",
      prompt: "",
      transferirApos: 0,
      filaTransferencia: "",
      encerrarApos: 0,
      mensagemEncerramento: "",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [editingConexao, setEditingConexao] = useState<Conexao | null>(null)
  const [formData, setFormData] = useState<Partial<Conexao>>({
    nome: "",
    padrao: false,
    mensagemSaudacao: "",
    mensagemConclusao: "",
    mensagemForaExpediente: "",
    mensagemAvaliacao: "",
    token: "",
    fila: "",
    prompt: "",
    transferirApos: 5,
    filaTransferencia: "",
    encerrarApos: 30,
    mensagemEncerramento: "",
  })

  const filteredConexoes = conexoes.filter((conexao) => conexao.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleOpenModal = (conexao?: Conexao) => {
    if (conexao) {
      setEditingConexao(conexao)
      setFormData(conexao)
    } else {
      setEditingConexao(null)
      setFormData({
        nome: "",
        padrao: false,
        mensagemSaudacao: "",
        mensagemConclusao: "",
        mensagemForaExpediente: "",
        mensagemAvaliacao: "",
        token: "",
        fila: "",
        prompt: "",
        transferirApos: 5,
        filaTransferencia: "",
        encerrarApos: 30,
        mensagemEncerramento: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveConexao = () => {
    if (!formData.nome?.trim()) {
      toast.error("Nome é obrigatório")
      return
    }

    if (editingConexao) {
      setConexoes((prev) =>
        prev.map((conexao) =>
          conexao.id === editingConexao.id
            ? { ...conexao, ...formData, ultimaAtualizacao: new Date().toLocaleString("pt-BR") }
            : conexao,
        ),
      )
      toast.success("Conexão atualizada com sucesso!")
    } else {
      const newConexao: Conexao = {
        id: Date.now().toString(),
        nome: formData.nome!,
        status: "desconectado",
        sessao: "QR CODE",
        ultimaAtualizacao: new Date().toLocaleString("pt-BR"),
        padrao: formData.padrao || false,
        mensagemSaudacao: formData.mensagemSaudacao || "",
        mensagemConclusao: formData.mensagemConclusao || "",
        mensagemForaExpediente: formData.mensagemForaExpediente || "",
        mensagemAvaliacao: formData.mensagemAvaliacao || "",
        token: formData.token || "",
        fila: formData.fila || "",
        prompt: formData.prompt || "",
        transferirApos: formData.transferirApos || 5,
        filaTransferencia: formData.filaTransferencia || "",
        encerrarApos: formData.encerrarApos || 30,
        mensagemEncerramento: formData.mensagemEncerramento || "",
      }
      setConexoes((prev) => [...prev, newConexao])
      toast.success("Conexão criada com sucesso!")
    }

    setIsModalOpen(false)
    setEditingConexao(null)
  }

  const handleDeleteConexao = (id: string) => {
    setConexoes((prev) => prev.filter((conexao) => conexao.id !== id))
    toast.success("Conexão excluída com sucesso!")
  }

  const handleToggleStatus = (id: string) => {
    setConexoes((prev) =>
      prev.map((conexao) =>
        conexao.id === id
          ? {
              ...conexao,
              status: conexao.status === "conectado" ? "desconectado" : "conectado",
              sessao: conexao.status === "conectado" ? "QR CODE" : "DESCONECTAR",
              ultimaAtualizacao: new Date().toLocaleString("pt-BR"),
            }
          : conexao,
      ),
    )
  }

  const handleShowQrCode = () => {
    setIsQrModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "conectado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "desconectado":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "conectando":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
      case "erro":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSessaoButton = (conexao: Conexao) => {
    if (conexao.status === "conectado") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          onClick={() => handleToggleStatus(conexao.id)}
        >
          DESCONECTAR
        </Button>
      )
    } else {
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
          onClick={handleShowQrCode}
        >
          QR CODE
        </Button>
      )
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <Smartphone className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conexões</h1>
            <p className="text-sm text-gray-500">Gerencie suas conexões WhatsApp</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#00183E] hover:bg-[#00183E]/90">
          <Plus className="h-4 w-4 mr-2" />
          ADICIONAR WHATSAPP
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar conexões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última atualização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Padrão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConexoes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Smartphone className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conexão encontrada</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm ? "Tente ajustar sua pesquisa." : "Comece criando sua primeira conexão WhatsApp."}
                      </p>
                      {!searchTerm && (
                        <Button onClick={() => handleOpenModal()} className="bg-[#00183E] hover:bg-[#00183E]/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Conexão
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConexoes.map((conexao) => (
                  <tr key={conexao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Smartphone className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{conexao.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusBadge(conexao.status)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">{conexao.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getSessaoButton(conexao)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {conexao.ultimaAtualizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {conexao.padrao && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(conexao)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenModal(conexao)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Configurações
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(conexao.id)}>
                              <Power className="h-4 w-4 mr-2" />
                              {conexao.status === "conectado" ? "Desconectar" : "Conectar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Reiniciar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteConexao(conexao.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Adicionar/Editar Conexão */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConexao ? "Editar WhatsApp" : "Adicionar WhatsApp"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Nome e Padrão */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome da conexão"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="padrao"
                  checked={formData.padrao || false}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, padrao: !!checked }))}
                />
                <Label htmlFor="padrao">Padrão</Label>
              </div>
            </div>

            {/* Mensagens */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mensagemSaudacao">Mensagem de saudação</Label>
                <Textarea
                  id="mensagemSaudacao"
                  value={formData.mensagemSaudacao || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mensagemSaudacao: e.target.value }))}
                  placeholder="Mensagem de boas-vindas..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagemConclusao">Mensagem de conclusão</Label>
                <Textarea
                  id="mensagemConclusao"
                  value={formData.mensagemConclusao || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mensagemConclusao: e.target.value }))}
                  placeholder="Mensagem de despedida..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagemForaExpediente">Mensagem de fora de expediente</Label>
                <Textarea
                  id="mensagemForaExpediente"
                  value={formData.mensagemForaExpediente || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mensagemForaExpediente: e.target.value }))}
                  placeholder="Mensagem para horário não comercial..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagemAvaliacao">Mensagem de avaliação</Label>
                <Textarea
                  id="mensagemAvaliacao"
                  value={formData.mensagemAvaliacao || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mensagemAvaliacao: e.target.value }))}
                  placeholder="Mensagem para solicitar avaliação..."
                  rows={3}
                />
              </div>
            </div>

            {/* Token, Filas e Prompt */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  value={formData.token || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, token: e.target.value }))}
                  placeholder="Token de acesso..."
                  type="password"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fila">Filas</Label>
                  <Select
                    value={formData.fila || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, fila: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fila" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suporte">Suporte</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Select
                    value={formData.prompt || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, prompt: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Atendimento Padrão">Atendimento Padrão</SelectItem>
                      <SelectItem value="Suporte Técnico">Suporte Técnico</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Redirecionamento de Fila */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Redirecionamento de Fila</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Selecione uma fila para os contatos que não possuem fila serem redirecionados
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transferirApos">Transferir após x (minutos)</Label>
                  <Input
                    id="transferirApos"
                    type="number"
                    value={formData.transferirApos || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, transferirApos: Number.parseInt(e.target.value) || 0 }))
                    }
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filaTransferencia">Fila de Transferência</Label>
                  <Select
                    value={formData.filaTransferencia || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, filaTransferencia: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fila" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suporte">Suporte</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="encerrarApos">Encerrar chat aberto após x minutos</Label>
                  <Input
                    id="encerrarApos"
                    type="number"
                    value={formData.encerrarApos || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, encerrarApos: Number.parseInt(e.target.value) || 0 }))
                    }
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagemEncerramento">Mensagem de encerramento por inatividade</Label>
                  <Select
                    value={formData.mensagemEncerramento || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, mensagemEncerramento: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma mensagem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chat encerrado por inatividade.">Chat encerrado por inatividade.</SelectItem>
                      <SelectItem value="Sessão finalizada automaticamente.">
                        Sessão finalizada automaticamente.
                      </SelectItem>
                      <SelectItem value="Atendimento encerrado por tempo limite.">
                        Atendimento encerrado por tempo limite.
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                CANCELAR
              </Button>
              <Button onClick={handleSaveConexao} className="bg-[#00183E] hover:bg-[#00183E]/90">
                {editingConexao ? "ATUALIZAR" : "ADICIONAR"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal QR Code */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Leia o QrCode para iniciar a sessão</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="w-64 h-64 bg-black flex items-center justify-center">
                <QrCode className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
