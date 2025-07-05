"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Settings, Edit, Trash2, HelpCircle } from "lucide-react"

interface Company {
  id: string
  name: string
  email: string
  phone: string
  plan: string
  campaigns: string
  active: boolean
  createdAt: string
  expiresAt: string
}

interface Plan {
  id: string
  name: string
  users: number
  connections: number
  queues: number
  value: number
  campaigns: string
  appointments: string
  internalChat: string
  externalApi: string
  kanban: string
  openAi: string
  integrations: string
}

interface HelpItem {
  id: string
  title: string
  description: string
  videoCode: string
}

export function ConfiguracoesContent() {
  const [activeTab, setActiveTab] = useState("opcoes")
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  // Estados para Opções
  const [options, setOptions] = useState({
    autoAccept: "Desabilitadas",
    acceptCampaigns: "Não Aceitar",
    transferMessages: "Desabilitado",
    expedientType: "Fila",
    chatbotType: "Texto",
    groupMessages: "Ativado",
    tokenSending: "Desabilitado",
    asaasToken: "",
  })

  // Estados para Empresas
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Empresa 1",
      email: "-",
      phone: "-",
      plan: "Plano 1",
      campaigns: "Desabilitadas",
      active: true,
      createdAt: "24/06/2025",
      expiresAt: "13/03/2093",
    },
  ])

  // Estados para Planos
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Plano 1",
      users: 10,
      connections: 10,
      queues: 10,
      value: 30.0,
      campaigns: "Sim",
      appointments: "Sim",
      internalChat: "Sim",
      externalApi: "Sim",
      kanban: "Sim",
      openAi: "Sim",
      integrations: "Sim",
    },
  ])

  // Estados para Ajuda
  const [helpItems, setHelpItems] = useState<HelpItem[]>([])

  const [planForm, setPlanForm] = useState({
    name: "",
    users: 0,
    connections: 0,
    queues: 0,
    value: 0,
    campaigns: "Habilitadas",
    appointments: "Habilitadas",
    internalChat: "Habilitadas",
    externalApi: "Habilitadas",
    kanban: "Habilitadas",
    openAi: "Habilitadas",
    integrations: "Habilitadas",
  })

  const [helpForm, setHelpForm] = useState({
    title: "",
    videoCode: "",
    description: "",
  })

  const handleSavePlan = () => {
    if (!planForm.name) {
      toast({
        title: "Erro",
        description: "Nome do plano é obrigatório",
        variant: "destructive",
      })
      return
    }

    const newPlan: Plan = {
      id: Date.now().toString(),
      name: planForm.name,
      users: planForm.users,
      connections: planForm.connections,
      queues: planForm.queues,
      value: planForm.value,
      campaigns: planForm.campaigns,
      appointments: planForm.appointments,
      internalChat: planForm.internalChat,
      externalApi: planForm.externalApi,
      kanban: planForm.kanban,
      openAi: planForm.openAi,
      integrations: planForm.integrations,
    }

    setPlans([...plans, newPlan])
    setPlanForm({
      name: "",
      users: 0,
      connections: 0,
      queues: 0,
      value: 0,
      campaigns: "Habilitadas",
      appointments: "Habilitadas",
      internalChat: "Habilitadas",
      externalApi: "Habilitadas",
      kanban: "Habilitadas",
      openAi: "Habilitadas",
      integrations: "Habilitadas",
    })
    setIsPlanModalOpen(false)
    toast({
      title: "Sucesso",
      description: "Plano criado com sucesso!",
    })
  }

  const handleSaveHelp = () => {
    if (!helpForm.title || !helpForm.description) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios",
        variant: "destructive",
      })
      return
    }

    const newHelpItem: HelpItem = {
      id: Date.now().toString(),
      title: helpForm.title,
      description: helpForm.description,
      videoCode: helpForm.videoCode,
    }

    setHelpItems([...helpItems, newHelpItem])
    setHelpForm({
      title: "",
      videoCode: "",
      description: "",
    })
    toast({
      title: "Sucesso",
      description: "Item de ajuda criado com sucesso!",
    })
  }

  const handleClearHelp = () => {
    setHelpForm({
      title: "",
      videoCode: "",
      description: "",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="opcoes">OPÇÕES</TabsTrigger>
            <TabsTrigger value="empresas">EMPRESAS</TabsTrigger>
            <TabsTrigger value="planos">PLANOS</TabsTrigger>
            <TabsTrigger value="ajuda">AJUDA</TabsTrigger>
          </TabsList>

          {/* Aba Opções */}
          <TabsContent value="opcoes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Aceitação Automática</Label>
                  <Select
                    value={options.autoAccept}
                    onValueChange={(value) => setOptions({ ...options, autoAccept: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                      <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Aceitar Campanhas</Label>
                  <Select
                    value={options.acceptCampaigns}
                    onValueChange={(value) => setOptions({ ...options, acceptCampaigns: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Não Aceitar">Não Aceitar</SelectItem>
                      <SelectItem value="Aceitar">Aceitar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Enviar mensagens de transferência de Fila apenas</Label>
                  <Select
                    value={options.transferMessages}
                    onValueChange={(value) => setOptions({ ...options, transferMessages: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desabilitado">Desabilitado</SelectItem>
                      <SelectItem value="Habilitado">Habilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Gerenciamento de Expediente</Label>
                  <Select
                    value={options.expedientType}
                    onValueChange={(value) => setOptions({ ...options, expedientType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fila">Fila</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tipo Chatbot</Label>
                  <Select
                    value={options.chatbotType}
                    onValueChange={(value) => setOptions({ ...options, chatbotType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Texto">Texto</SelectItem>
                      <SelectItem value="Voz">Voz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Ignorar Mensagens de Grupos</Label>
                  <Select
                    value={options.groupMessages}
                    onValueChange={(value) => setOptions({ ...options, groupMessages: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativado">Ativado</SelectItem>
                      <SelectItem value="Desativado">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Enviar mensagem do Servidor a token</Label>
                  <Select
                    value={options.tokenSending}
                    onValueChange={(value) => setOptions({ ...options, tokenSending: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desabilitado">Desabilitado</SelectItem>
                      <SelectItem value="Habilitado">Habilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-teal-600 mb-4">INTEGRAÇÕES</h3>
              <div className="space-y-4">
                <h4 className="text-md font-medium text-teal-600">ASAAS</h4>
                <div className="max-w-md">
                  <Input
                    placeholder="Token Asaas"
                    value={options.asaasToken}
                    onChange={(e) => setOptions({ ...options, asaasToken: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Aba Empresas */}
          <TabsContent value="empresas" className="space-y-6">
            <div className="flex justify-end space-x-2">
              <Button className="bg-[#00183E] hover:bg-[#00183E]/90">+ VENCIMENTO</Button>
              <Button className="bg-[#00183E] hover:bg-[#00183E]/90">USUÁRIO</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Campanhas</TableHead>
                  <TableHead>Ativado</TableHead>
                  <TableHead>Criada Em</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Editar</TableHead>
                  <TableHead>Apagar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell>{company.plan}</TableCell>
                    <TableCell>{company.campaigns}</TableCell>
                    <TableCell>{company.active ? "Sim" : "Não"}</TableCell>
                    <TableCell>{company.createdAt}</TableCell>
                    <TableCell>{company.expiresAt}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Aba Planos */}
          <TabsContent value="planos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Nome</Label>
                <Input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-sm font-medium">Usuários</Label>
                <Input
                  type="number"
                  value={planForm.users}
                  onChange={(e) => setPlanForm({ ...planForm, users: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Conexões</Label>
                <Input
                  type="number"
                  value={planForm.connections}
                  onChange={(e) => setPlanForm({ ...planForm, connections: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Filas</Label>
                <Input
                  type="number"
                  value={planForm.queues}
                  onChange={(e) => setPlanForm({ ...planForm, queues: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Valor</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={planForm.value}
                  onChange={(e) => setPlanForm({ ...planForm, value: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Campanhas</Label>
                <Select
                  value={planForm.campaigns}
                  onValueChange={(value) => setPlanForm({ ...planForm, campaigns: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Agendamentos</Label>
                <Select
                  value={planForm.appointments}
                  onValueChange={(value) => setPlanForm({ ...planForm, appointments: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Chat Interno</Label>
                <Select
                  value={planForm.internalChat}
                  onValueChange={(value) => setPlanForm({ ...planForm, internalChat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">API Externa</Label>
                <Select
                  value={planForm.externalApi}
                  onValueChange={(value) => setPlanForm({ ...planForm, externalApi: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Kanban</Label>
                <Select value={planForm.kanban} onValueChange={(value) => setPlanForm({ ...planForm, kanban: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Open.AI</Label>
                <Select value={planForm.openAi} onValueChange={(value) => setPlanForm({ ...planForm, openAi: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Integrações</Label>
                <Select
                  value={planForm.integrations}
                  onValueChange={(value) => setPlanForm({ ...planForm, integrations: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habilitadas">Habilitadas</SelectItem>
                    <SelectItem value="Desabilitadas">Desabilitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">CANCELAR</Button>
              <Button onClick={handleSavePlan} className="bg-[#00183E] hover:bg-[#00183E]/90">
                SALVAR
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Conexões</TableHead>
                  <TableHead>Filas</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Campanhas</TableHead>
                  <TableHead>Agendamentos</TableHead>
                  <TableHead>Chat Interno</TableHead>
                  <TableHead>API Externa</TableHead>
                  <TableHead>Kanban</TableHead>
                  <TableHead>Open.AI</TableHead>
                  <TableHead>Integrações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan, index) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.users}</TableCell>
                    <TableCell>{plan.connections}</TableCell>
                    <TableCell>{plan.queues}</TableCell>
                    <TableCell>R$ {plan.value.toFixed(2)}</TableCell>
                    <TableCell>{plan.campaigns}</TableCell>
                    <TableCell>{plan.appointments}</TableCell>
                    <TableCell>{plan.internalChat}</TableCell>
                    <TableCell>{plan.externalApi}</TableCell>
                    <TableCell>{plan.kanban}</TableCell>
                    <TableCell>{plan.openAi}</TableCell>
                    <TableCell>{plan.integrations}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Aba Ajuda */}
          <TabsContent value="ajuda" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <Input value={helpForm.title} onChange={(e) => setHelpForm({ ...helpForm, title: e.target.value })} />
              </div>
              <div>
                <Label className="text-sm font-medium">Código do Vídeo</Label>
                <Input
                  value={helpForm.videoCode}
                  onChange={(e) => setHelpForm({ ...helpForm, videoCode: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea
                  value={helpForm.description}
                  onChange={(e) => setHelpForm({ ...helpForm, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClearHelp}>
                LIMPAR
              </Button>
              <Button onClick={handleSaveHelp} className="bg-[#00183E] hover:bg-[#00183E]/90">
                SALVAR
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Vídeo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {helpItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.videoCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {helpItems.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item de ajuda encontrado</h3>
                <p className="text-gray-500">Comece adicionando um novo item de ajuda</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
