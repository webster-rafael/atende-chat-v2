"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Code, Send, FileText, ImageIcon, Copy, CheckCircle } from "lucide-react"

export function ApiContent() {
  const [textForm, setTextForm] = useState({
    token: "",
    number: "",
    message: "",
  })

  const [mediaForm, setMediaForm] = useState({
    token: "",
    number: "",
    file: null as File | null,
  })

  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textForm.token || !textForm.number || !textForm.message) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Mensagem enviada",
      description: `Mensagem de texto enviada para ${textForm.number}`,
    })
  }

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mediaForm.token || !mediaForm.number || !mediaForm.file) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos e selecione um arquivo.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Mídia enviada",
      description: `Arquivo enviado para ${mediaForm.number}`,
    })
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(null), 2000)
    toast({
      title: "Copiado!",
      description: "Código copiado para a área de transferência.",
    })
  }

  const textMessageExample = `{
  "number": "5511999887743",
  "body": "Sua mensagem"
}`

  const mediaMessageExample = `FormData:
- number: 5511999887743
- medias: arquivo`

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Code className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Documentação para envio de mensagens</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documentação */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métodos de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">1</span>
                    <span>Mensagens de Texto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">2</span>
                    <span>Mensagens de Mídia</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instruções</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Observações importantes</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Antes de enviar mensagens, é necessário o cadastro do token vinculado à conexão que enviará as
                          mensagens.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Para realizar o cadastro acesse o menu "Conexões", clique no botão editar da conexão e insira
                          o token no devido campo.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          O número para envio não deve ter máscara ou caracteres especiais e deve ser composto por:
                        </span>
                      </li>
                    </ul>
                    <div className="ml-6 mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>Código do país</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>DDD</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>Número</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mensagens de Texto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  1. Mensagens de Texto
                </CardTitle>
                <CardDescription>
                  Segue abaixo a lista de informações necessárias para envio das mensagens de texto:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Endpoint:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                      http://localhost:5008/api/messages/send
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Método:</span>
                    <Badge variant="secondary" className="ml-2">
                      POST
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Headers:</span>
                    <span className="ml-2 text-sm text-gray-600">
                      X_TOKEN (token cadastrado) e Content-Type (application/json)
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Body:</span>
                    <div className="mt-2 relative">
                      <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                        <code>{textMessageExample}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(textMessageExample, "text")}
                      >
                        {copiedCode === "text" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mensagens de Mídia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  2. Mensagens de Mídia
                </CardTitle>
                <CardDescription>
                  Segue abaixo a lista de informações necessárias para envio das mensagens de mídia:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Endpoint:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                      http://localhost:5008/api/messages/send
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Método:</span>
                    <Badge variant="secondary" className="ml-2">
                      POST
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Headers:</span>
                    <span className="ml-2 text-sm text-gray-600">
                      X_TOKEN (token cadastrado) e Content-Type (multipart/form-data)
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">FormData:</span>
                    <div className="mt-2 relative">
                      <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                        <code>{mediaMessageExample}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(mediaMessageExample, "media")}
                      >
                        {copiedCode === "media" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>
                          <strong>number:</strong> 5511999817243
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>
                          <strong>medias:</strong> arquivo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testes de Envio */}
          <div className="space-y-6">
            {/* Teste de Mensagem de Texto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teste de Envio</CardTitle>
                <CardDescription>Teste o envio de mensagens de texto</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTextSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-token">Token cadastrado *</Label>
                    <Input
                      id="text-token"
                      placeholder="Token cadastrado *"
                      value={textForm.token}
                      onChange={(e) => setTextForm({ ...textForm, token: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-number">Número *</Label>
                    <Input
                      id="text-number"
                      placeholder="Número *"
                      value={textForm.number}
                      onChange={(e) => setTextForm({ ...textForm, number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-message">Mensagem *</Label>
                    <Textarea
                      id="text-message"
                      placeholder="Mensagem *"
                      value={textForm.message}
                      onChange={(e) => setTextForm({ ...textForm, message: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#00183E] hover:bg-[#00183E]/90">
                    <Send className="h-4 w-4 mr-2" />
                    ENVIAR
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Teste de Mensagem de Mídia */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teste de Envio</CardTitle>
                <CardDescription>Teste o envio de mensagens de mídia</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMediaSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="media-token">Token cadastrado *</Label>
                    <Input
                      id="media-token"
                      placeholder="Token cadastrado *"
                      value={mediaForm.token}
                      onChange={(e) => setMediaForm({ ...mediaForm, token: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-number">Número *</Label>
                    <Input
                      id="media-number"
                      placeholder="Número *"
                      value={mediaForm.number}
                      onChange={(e) => setMediaForm({ ...mediaForm, number: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-file">Escolher arquivo</Label>
                    <Input
                      id="media-file"
                      type="file"
                      onChange={(e) => setMediaForm({ ...mediaForm, file: e.target.files?.[0] || null })}
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      required
                    />
                    <p className="text-xs text-gray-500">Nenhum arquivo escolhido</p>
                  </div>
                  <Button type="submit" className="w-full bg-[#00183E] hover:bg-[#00183E]/90">
                    <Send className="h-4 w-4 mr-2" />
                    ENVIAR
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
