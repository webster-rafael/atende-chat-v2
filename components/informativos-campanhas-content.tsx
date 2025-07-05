"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  User,
  Filter,
  Download,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Informativo {
  id: string
  titulo: string
  conteudo: string
  tipo: "info" | "aviso" | "sucesso" | "urgente"
  status: "ativo" | "inativo" | "agendado"
  dataPublicacao: string
  dataExpiracao?: string
  autor: string
  visualizacoes: number
}

export function InformativosCampanhasContent() {
  const [informativos, setInformativos] = useState<Informativo[]>([
    {
      id: "1",
      titulo: "Nova funcionalidade de agendamento",
      conteudo: "Agora você pode agendar suas campanhas para serem executadas automaticamente em horários específicos.",
      tipo: "info",
      status: "ativo",
      dataPublicacao: "2024-01-15",
      dataExpiracao: "2024-02-15",
      autor: "Admin",
      visualizacoes: 245,
    },
    {
      id: "2",
      titulo: "Manutenção programada - 20/01",
      conteudo:
        "Haverá uma manutenção programada no sistema no dia 20/01 das 02:00 às 04:00. Durante este período, o envio de campanhas ficará temporariamente indisponível.",
      tipo: "aviso",
      status: "ativo",
      dataPublicacao: "2024-01-10",
      dataExpiracao: "2024-01-21",
      autor: "Suporte Técnico",
      visualizacoes: 189,
    },
    {
      id: "3",
      titulo: "Limite de campanhas aumentado",
      conteudo: "O limite de campanhas simultâneas foi aumentado de 3 para 5 para todos os usuários premium.",
      tipo: "sucesso",
      status: "ativo",
      dataPublicacao: "2024-01-08",
      autor: "Admin",
      visualizacoes: 156,
    },
    {
      id: "4",
      titulo: "Atualização de segurança crítica",
      conteudo:
        "Uma atualização de segurança crítica foi aplicada. Recomendamos que todos os usuários alterem suas senhas.",
      tipo: "urgente",
      status: "ativo",
      dataPublicacao: "2024-01-05",
      dataExpiracao: "2024-01-25",
      autor: "Segurança",
      visualizacoes: 312,
    },
    {
      id: "5",
      titulo: "Novos templates disponíveis",
      conteudo: "Adicionamos 15 novos templates de mensagem para suas campanhas. Confira na seção de templates.",
      tipo: "info",
      status: "agendado",
      dataPublicacao: "2024-01-20",
      autor: "Marketing",
      visualizacoes: 0,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState<string>("todos")
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newInformativo, setNewInformativo] = useState({
    titulo: "",
    conteudo: "",
    tipo: "info" as const,
    status: "ativo" as const,
    dataExpiracao: "",
  })

  const filteredInformativos = informativos.filter((informativo) => {
    const matchesSearch =
      informativo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      informativo.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === "todos" || informativo.tipo === filterTipo
    const matchesStatus = filterStatus === "todos" || informativo.status === filterStatus

    return matchesSearch && matchesTipo && matchesStatus
  })

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "info":
        return <Info className="w-4 h-4" />
      case "aviso":
        return <AlertTriangle className="w-4 h-4" />
      case "sucesso":
        return <CheckCircle className="w-4 h-4" />
      case "urgente":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "aviso":
        return "bg-yellow-100 text-yellow-800"
      case "sucesso":
        return "bg-green-100 text-green-800"
      case "urgente":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800"
      case "inativo":
        return "bg-gray-100 text-gray-800"
      case "agendado":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateInformativo = () => {
    const novoInformativo: Informativo = {
      id: Date.now().toString(),
      ...newInformativo,
      dataPublicacao: new Date().toISOString().split("T")[0],
      autor: "Usuário Atual",
      visualizacoes: 0,
    }

    setInformativos([novoInformativo, ...informativos])
    setNewInformativo({
      titulo: "",
      conteudo: "",
      tipo: "info",
      status: "ativo",
      dataExpiracao: "",
    })
    setIsCreateModalOpen(false)

    toast({
      title: "Informativo criado",
      description: "O informativo foi criado com sucesso.",
    })
  }

  const handleDeleteInformativo = (id: string) => {
    setInformativos(informativos.filter((info) => info.id !== id))
    toast({
      title: "Informativo excluído",
      description: "O informativo foi excluído com sucesso.",
      variant: "destructive",
    })
  }

  const stats = {
    total: informativos.length,
    ativos: informativos.filter((i) => i.status === "ativo").length,
    agendados: informativos.filter((i) => i.status === "agendado").length,
    visualizacoes: informativos.reduce((acc, i) => acc + i.visualizacoes, 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informativos</h1>
          <p className="text-gray-600 mt-1">Gerencie comunicados e informações importantes</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Informativo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Informativo</DialogTitle>
              <DialogDescription>
                Crie um novo informativo para comunicar informações importantes aos usuários.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={newInformativo.titulo}
                  onChange={(e) => setNewInformativo({ ...newInformativo, titulo: e.target.value })}
                  placeholder="Digite o título do informativo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo">Conteúdo</Label>
                <Textarea
                  id="conteudo"
                  value={newInformativo.conteudo}
                  onChange={(e) => setNewInformativo({ ...newInformativo, conteudo: e.target.value })}
                  placeholder="Digite o conteúdo do informativo"
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={newInformativo.tipo}
                    onValueChange={(value: any) => setNewInformativo({ ...newInformativo, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informação</SelectItem>
                      <SelectItem value="aviso">Aviso</SelectItem>
                      <SelectItem value="sucesso">Sucesso</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newInformativo.status}
                    onValueChange={(value: any) => setNewInformativo({ ...newInformativo, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="agendado">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataExpiracao">Data de Expiração (opcional)</Label>
                <Input
                  id="dataExpiracao"
                  type="date"
                  value={newInformativo.dataExpiracao}
                  onChange={(e) => setNewInformativo({ ...newInformativo, dataExpiracao: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateInformativo}>Criar Informativo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.agendados}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-purple-600">{stats.visualizacoes.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar informativos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="aviso">Aviso</SelectItem>
                  <SelectItem value="sucesso">Sucesso</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informativos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Informativos</CardTitle>
          <CardDescription>Gerencie todos os informativos do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publicação</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInformativos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Info className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">Nenhum informativo encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInformativos.map((informativo) => (
                  <TableRow key={informativo.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{informativo.titulo}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{informativo.conteudo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTipoBadgeColor(informativo.tipo)}>
                        <div className="flex items-center space-x-1">
                          {getTipoIcon(informativo.tipo)}
                          <span className="capitalize">{informativo.tipo}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(informativo.status)}>
                        <span className="capitalize">{informativo.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(informativo.dataPublicacao).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{informativo.autor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{informativo.visualizacoes}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteInformativo(informativo.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
