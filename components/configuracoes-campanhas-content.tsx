"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Clock, Shield, Zap, MessageSquare, Save, RotateCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ConfiguracoesCampanhasContent() {
  const [settings, setSettings] = useState({
    // Configurações Gerais
    maxCampanhasSimultaneas: "5",
    intervaloPadrao: "30",
    tentativasMaximas: "3",
    timeoutResposta: "60",

    // Notificações
    notificarInicio: true,
    notificarConclusao: true,
    notificarErros: true,
    notificarRelatorios: false,

    // Horários
    horarioInicio: "08:00",
    horarioFim: "18:00",
    diasSemana: ["seg", "ter", "qua", "qui", "sex"],

    // Segurança
    requireAprovacao: true,
    logAuditoria: true,
    backupAutomatico: true,

    // Integrações
    webhookUrl: "",
    apiKey: "",
    conexaoPadrao: "whatsapp-1",
  })

  const [activeTab, setActiveTab] = useState("geral")

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    })
  }

  const handleReset = () => {
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para os valores padrão.",
      variant: "destructive",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de Campanhas</h1>
          <p className="text-gray-600 mt-1">Gerencie as configurações globais do módulo de campanhas</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Geral</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Horários</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Integrações</span>
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configurações Gerais</span>
              </CardTitle>
              <CardDescription>Configure os parâmetros básicos para o funcionamento das campanhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxCampanhas">Máximo de Campanhas Simultâneas</Label>
                  <Input
                    id="maxCampanhas"
                    type="number"
                    value={settings.maxCampanhasSimultaneas}
                    onChange={(e) => setSettings({ ...settings, maxCampanhasSimultaneas: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">Número máximo de campanhas que podem executar ao mesmo tempo</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intervalo">Intervalo Padrão (segundos)</Label>
                  <Input
                    id="intervalo"
                    type="number"
                    value={settings.intervaloPadrao}
                    onChange={(e) => setSettings({ ...settings, intervaloPadrao: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">Tempo de espera entre envios de mensagens</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tentativas">Tentativas Máximas</Label>
                  <Input
                    id="tentativas"
                    type="number"
                    value={settings.tentativasMaximas}
                    onChange={(e) => setSettings({ ...settings, tentativasMaximas: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">Número de tentativas em caso de falha no envio</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout de Resposta (segundos)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={settings.timeoutResposta}
                    onChange={(e) => setSettings({ ...settings, timeoutResposta: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">Tempo limite para aguardar resposta da API</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Configurações de Mensagem</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assinatura">Assinatura Padrão</Label>
                <Textarea
                  id="assinatura"
                  placeholder="Digite a assinatura padrão para as campanhas..."
                  className="min-h-[100px]"
                />
                <p className="text-sm text-gray-500">Texto que será adicionado ao final de todas as mensagens</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Configurações de Notificação</span>
              </CardTitle>
              <CardDescription>Configure quando e como receber notificações sobre suas campanhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificar Início de Campanha</Label>
                    <p className="text-sm text-gray-500">Receba uma notificação quando uma campanha for iniciada</p>
                  </div>
                  <Switch
                    checked={settings.notificarInicio}
                    onCheckedChange={(checked) => setSettings({ ...settings, notificarInicio: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificar Conclusão de Campanha</Label>
                    <p className="text-sm text-gray-500">Receba uma notificação quando uma campanha for concluída</p>
                  </div>
                  <Switch
                    checked={settings.notificarConclusao}
                    onCheckedChange={(checked) => setSettings({ ...settings, notificarConclusao: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificar Erros</Label>
                    <p className="text-sm text-gray-500">Receba notificações sobre erros durante a execução</p>
                  </div>
                  <Switch
                    checked={settings.notificarErros}
                    onCheckedChange={(checked) => setSettings({ ...settings, notificarErros: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Relatórios Automáticos</Label>
                    <p className="text-sm text-gray-500">Receba relatórios automáticos por email</p>
                  </div>
                  <Switch
                    checked={settings.notificarRelatorios}
                    onCheckedChange={(checked) => setSettings({ ...settings, notificarRelatorios: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Horários */}
        <TabsContent value="horarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Horários de Funcionamento</span>
              </CardTitle>
              <CardDescription>Configure os horários permitidos para execução de campanhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horário de Início</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={settings.horarioInicio}
                    onChange={(e) => setSettings({ ...settings, horarioInicio: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Horário de Fim</Label>
                  <Input
                    id="horarioFim"
                    type="time"
                    value={settings.horarioFim}
                    onChange={(e) => setSettings({ ...settings, horarioFim: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dias da Semana</Label>
                <div className="flex space-x-2">
                  {[
                    { key: "seg", label: "Seg" },
                    { key: "ter", label: "Ter" },
                    { key: "qua", label: "Qua" },
                    { key: "qui", label: "Qui" },
                    { key: "sex", label: "Sex" },
                    { key: "sab", label: "Sáb" },
                    { key: "dom", label: "Dom" },
                  ].map((dia) => (
                    <Badge
                      key={dia.key}
                      variant={settings.diasSemana.includes(dia.key) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const newDias = settings.diasSemana.includes(dia.key)
                          ? settings.diasSemana.filter((d) => d !== dia.key)
                          : [...settings.diasSemana, dia.key]
                        setSettings({ ...settings, diasSemana: newDias })
                      }}
                    >
                      {dia.label}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Clique nos dias para ativar/desativar</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Configurações de Segurança</span>
              </CardTitle>
              <CardDescription>Configure as políticas de segurança para campanhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Requer Aprovação</Label>
                    <p className="text-sm text-gray-500">Campanhas precisam ser aprovadas antes da execução</p>
                  </div>
                  <Switch
                    checked={settings.requireAprovacao}
                    onCheckedChange={(checked) => setSettings({ ...settings, requireAprovacao: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log de Auditoria</Label>
                    <p className="text-sm text-gray-500">Registrar todas as ações realizadas no sistema</p>
                  </div>
                  <Switch
                    checked={settings.logAuditoria}
                    onCheckedChange={(checked) => setSettings({ ...settings, logAuditoria: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-gray-500">Realizar backup automático dos dados das campanhas</p>
                  </div>
                  <Switch
                    checked={settings.backupAutomatico}
                    onCheckedChange={(checked) => setSettings({ ...settings, backupAutomatico: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrações */}
        <TabsContent value="integracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Configurações de Integração</span>
              </CardTitle>
              <CardDescription>Configure as integrações com serviços externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conexaoPadrao">Conexão Padrão</Label>
                  <Select
                    value={settings.conexaoPadrao}
                    onValueChange={(value) => setSettings({ ...settings, conexaoPadrao: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp-1">WhatsApp Business 1</SelectItem>
                      <SelectItem value="whatsapp-2">WhatsApp Business 2</SelectItem>
                      <SelectItem value="telegram-1">Telegram Bot 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL do Webhook</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="https://exemplo.com/webhook"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">URL para receber notificações de eventos</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">Chave da API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Digite sua chave da API"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">Chave para autenticação com APIs externas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
