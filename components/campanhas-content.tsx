"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Edit,
  Trash2,
  Megaphone,
  Users,
  Calendar,
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  status: "active" | "paused" | "completed" | "scheduled" | "draft"
  contactList: string
  contactCount: number
  connection: string
  scheduledDate?: string
  completedPercentage: number
  completedCount: number
  totalCount: number
  confirmationPercentage: number
  confirmationCount: number
  createdAt: string
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Promoção Black Friday 2024",
    status: "active",
    contactList: "Clientes Premium",
    contactCount: 1250,
    connection: "WhatsApp Business",
    completedPercentage: 68.5,
    completedCount: 856,
    totalCount: 1250,
    confirmationPercentage: 45.2,
    confirmationCount: 565,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Lançamento Produto XYZ",
    status: "paused",
    contactList: "Leads Qualificados",
    contactCount: 890,
    connection: "WhatsApp API",
    completedPercentage: 50.0,
    completedCount: 445,
    totalCount: 890,
    confirmationPercentage: 32.1,
    confirmationCount: 286,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Pesquisa de Satisfação",
    status: "completed",
    contactList: "Clientes Ativos",
    contactCount: 2100,
    connection: "WhatsApp Business",
    completedPercentage: 100,
    completedCount: 2100,
    totalCount: 2100,
    confirmationPercentage: 78.5,
    confirmationCount: 1649,
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Convite Webinar Gratuito",
    status: "scheduled",
    contactList: "Newsletter",
    contactCount: 3200,
    connection: "WhatsApp API",
    scheduledDate: "2024-01-25 14:00",
    completedPercentage: 0,
    completedCount: 0,
    totalCount: 3200,
    confirmationPercentage: 0,
    confirmationCount: 0,
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "Recuperação de Carrinho",
    status: "draft",
    contactList: "Carrinho Abandonado",
    contactCount: 567,
    connection: "WhatsApp Business",
    completedPercentage: 0,
    completedCount: 0,
    totalCount: 567,
    confirmationPercentage: 0,
    confirmationCount: 0,
    createdAt: "2024-01-18",
  },
]

const getStatusBadge = (status: Campaign["status"]) => {
  const statusConfig = {
    active: { label: "Ativa", color: "bg-green-100 text-green-800", icon: Play },
    paused: { label: "Pausada", color: "bg-yellow-100 text-yellow-800", icon: Pause },
    completed: { label: "Concluída", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    scheduled: { label: "Agendada", color: "bg-purple-100 text-purple-800", icon: Clock },
    draft: { label: "Rascunho", color: "bg-gray-100 text-gray-800", icon: FileText },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  )
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatNumber = (num: number) => {
  return num.toLocaleString("pt-BR")
}

export function CampanhasContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.contactList.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.connection.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    completed: campaigns.filter((c) => c.status === "completed").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
  }

  const toggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              status: campaign.status === "active" ? "paused" : "active",
            }
          : campaign,
      ),
    )
  }

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
          <p className="text-gray-600">Gerencie suas campanhas de marketing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar campanhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
            <Plus className="w-4 h-4 mr-2" />
            NOVA CAMPANHA
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todas as campanhas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Em execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Para executar</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma campanha encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Tente ajustar sua pesquisa." : "Comece criando uma nova campanha."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Campanha
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lista de contatos</TableHead>
                  <TableHead>Conexão</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Concluída</TableHead>
                  <TableHead>Confirmação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">
                          Criada em {new Date(campaign.createdAt).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.contactList}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {formatNumber(campaign.contactCount)} contatos
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.connection}</TableCell>
                    <TableCell>
                      {campaign.scheduledDate ? (
                        <div className="text-sm">
                          <div>{formatDate(campaign.scheduledDate)}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{campaign.completedPercentage.toFixed(1)}%</span>
                          <span className="text-gray-500">
                            {formatNumber(campaign.completedCount)}/{formatNumber(campaign.totalCount)}
                          </span>
                        </div>
                        <Progress value={campaign.completedPercentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600">{campaign.confirmationPercentage.toFixed(1)}%</span>
                          <span className="text-gray-500">
                            {formatNumber(campaign.confirmationCount)}/{formatNumber(campaign.completedCount)}
                          </span>
                        </div>
                        <Progress
                          value={campaign.confirmationPercentage}
                          className="h-2"
                          style={{
                            background: "rgb(220 252 231)",
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar campanha
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Ver relatórios
                          </DropdownMenuItem>
                          {campaign.status === "active" || campaign.status === "paused" ? (
                            <DropdownMenuItem onClick={() => toggleCampaignStatus(campaign.id)}>
                              {campaign.status === "active" ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pausar campanha
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Ativar campanha
                                </>
                              )}
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteCampaign(campaign.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir campanha
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
