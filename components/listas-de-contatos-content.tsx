"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Users,
  Download,
  Edit,
  Trash2,
  MoreHorizontal,
  Upload,
  FileText,
  UserPlus,
  Calendar,
} from "lucide-react"

interface ContactList {
  id: string
  name: string
  description: string
  contactCount: number
  createdAt: string
  updatedAt: string
  status: "active" | "inactive"
  source: "manual" | "import" | "api"
}

const mockContactLists: ContactList[] = [
  {
    id: "1",
    name: "Clientes Premium",
    description: "Lista de clientes com plano premium ativo",
    contactCount: 1250,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    status: "active",
    source: "import",
  },
  {
    id: "2",
    name: "Leads Qualificados",
    description: "Prospects que demonstraram interesse nos produtos",
    contactCount: 890,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    status: "active",
    source: "manual",
  },
  {
    id: "3",
    name: "Newsletter Subscribers",
    description: "Usuários inscritos na newsletter mensal",
    contactCount: 3200,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-19",
    status: "active",
    source: "api",
  },
  {
    id: "4",
    name: "Carrinho Abandonado",
    description: "Clientes que abandonaram itens no carrinho",
    contactCount: 567,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-17",
    status: "active",
    source: "import",
  },
  {
    id: "5",
    name: "Clientes Inativos",
    description: "Clientes sem compras nos últimos 6 meses",
    contactCount: 445,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    status: "inactive",
    source: "manual",
  },
]

const getSourceBadge = (source: ContactList["source"]) => {
  const sourceConfig = {
    manual: { label: "Manual", color: "bg-blue-100 text-blue-800" },
    import: { label: "Importação", color: "bg-green-100 text-green-800" },
    api: { label: "API", color: "bg-purple-100 text-purple-800" },
  }

  const config = sourceConfig[source]
  return <Badge className={config.color}>{config.label}</Badge>
}

const formatNumber = (num: number) => {
  return num.toLocaleString("pt-BR")
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

export function ListasDeContatosContent() {
  const [contactLists, setContactLists] = useState<ContactList[]>(mockContactLists)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newList, setNewList] = useState({
    name: "",
    description: "",
  })

  const filteredLists = contactLists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: contactLists.length,
    active: contactLists.filter((list) => list.status === "active").length,
    totalContacts: contactLists.reduce((sum, list) => sum + list.contactCount, 0),
    avgContacts: Math.round(contactLists.reduce((sum, list) => sum + list.contactCount, 0) / contactLists.length),
  }

  const handleCreateList = () => {
    if (newList.name.trim()) {
      const newContactList: ContactList = {
        id: Date.now().toString(),
        name: newList.name,
        description: newList.description,
        contactCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        status: "active",
        source: "manual",
      }

      setContactLists([newContactList, ...contactLists])
      setNewList({ name: "", description: "" })
      setIsCreateModalOpen(false)
    }
  }

  const handleDeleteList = (id: string) => {
    setContactLists(contactLists.filter((list) => list.id !== id))
  }

  const toggleListStatus = (id: string) => {
    setContactLists(
      contactLists.map((list) =>
        list.id === id
          ? {
              ...list,
              status: list.status === "active" ? "inactive" : "active",
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : list,
      ),
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listas de Contatos</h1>
          <p className="text-gray-600">Gerencie suas listas de contatos para campanhas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
                <Plus className="w-4 h-4 mr-2" />
                NOVA LISTA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Lista de Contatos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Lista</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Clientes VIP"
                    value={newList.name}
                    onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o propósito desta lista..."
                    value={newList.description}
                    onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateList} className="bg-[#00183E] hover:bg-[#00183E]/90">
                  Criar Lista
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Listas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Listas criadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listas Ativas</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Em uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatNumber(stats.totalContacts)}</div>
            <p className="text-xs text-muted-foreground">Contatos únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Lista</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatNumber(stats.avgContacts)}</div>
            <p className="text-xs text-muted-foreground">Contatos/lista</p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listas de Contatos ({filteredLists.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLists.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma lista encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Tente ajustar sua pesquisa." : "Comece criando uma nova lista de contatos."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#00183E] hover:bg-[#00183E]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Lista
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contatos</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizada</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{list.name}</div>
                        <div className="text-sm text-gray-500">{list.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{formatNumber(list.contactCount)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getSourceBadge(list.source)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          list.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {list.status === "active" ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">{formatDate(list.updatedAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="Baixar lista">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Editar lista">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Upload className="mr-2 h-4 w-4" />
                              Importar contatos
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Adicionar contato
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleListStatus(list.id)}>
                              {list.status === "active" ? (
                                <>
                                  <Users className="mr-2 h-4 w-4" />
                                  Desativar lista
                                </>
                              ) : (
                                <>
                                  <Users className="mr-2 h-4 w-4" />
                                  Ativar lista
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteList(list.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir lista
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
