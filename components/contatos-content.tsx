"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, MessageCircle, Phone, Mail, Upload, Download, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

interface CustomField {
  name: string
  value: string
}

interface Contact {
  id: string
  name: string
  whatsapp: string
  email?: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen: string
  tags: string[]
  source: string
  customFields: CustomField[]
  createdAt: string
  updatedAt: string
}

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    whatsapp: "5567991352504",
    email: "joao.silva@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastSeen: "Agora",
    tags: ["Cliente VIP", "Vendas"],
    source: "WhatsApp",
    customFields: [
      { name: "Empresa", value: "Tech Solutions" },
      { name: "Cargo", value: "Gerente" },
    ],
    createdAt: "2025-01-07",
    updatedAt: "2025-01-07",
  },
  {
    id: "2",
    name: "Maria Santos",
    whatsapp: "5567993372205",
    email: "maria.santos@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: "2 horas atrás",
    tags: ["Suporte"],
    source: "Site",
    customFields: [{ name: "Interesse", value: "Plano Premium" }],
    createdAt: "2025-01-06",
    updatedAt: "2025-01-07",
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    whatsapp: "12036316234688069",
    email: "carlos@empresa.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastSeen: "1 dia atrás",
    tags: ["Prospect"],
    source: "Indicação",
    customFields: [],
    createdAt: "2025-01-05",
    updatedAt: "2025-01-06",
  },
  {
    id: "4",
    name: "Ana Costa",
    whatsapp: "12036318460560303",
    email: "ana.costa@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastSeen: "Agora",
    tags: ["Cliente", "Atendimento"],
    source: "WhatsApp",
    customFields: [{ name: "Plano", value: "Básico" }],
    createdAt: "2025-01-04",
    updatedAt: "2025-01-07",
  },
  {
    id: "5",
    name: "Pedro Lima",
    whatsapp: "12036319680390929",
    email: "",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: "3 dias atrás",
    tags: ["Lead"],
    source: "Facebook",
    customFields: [],
    createdAt: "2025-01-03",
    updatedAt: "2025-01-04",
  },
]

export function ContatosContent() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [newContact, setNewContact] = useState({
    name: "",
    whatsapp: "",
    email: "",
    source: "",
    customFields: [] as CustomField[],
  })

  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.whatsapp.includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-400"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.whatsapp.trim()) return

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      whatsapp: newContact.whatsapp,
      email: newContact.email,
      status: "offline",
      lastSeen: "Nunca",
      tags: [],
      source: newContact.source || "Manual",
      customFields: newContact.customFields.filter((field) => field.name && field.value),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setContacts([contact, ...contacts])
    setNewContact({
      name: "",
      whatsapp: "",
      email: "",
      source: "",
      customFields: [],
    })
    setIsAddingContact(false)
  }

  const updateContact = () => {
    if (!editingContact) return

    const updatedContacts = contacts.map((contact) =>
      contact.id === editingContact.id
        ? { ...editingContact, updatedAt: new Date().toISOString().split("T")[0] }
        : contact,
    )

    setContacts(updatedContacts)
    setEditingContact(null)
  }

  const deleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
    setSelectedContacts(selectedContacts.filter((contactId) => contactId !== id))
  }

  const deleteSelectedContacts = () => {
    setContacts(contacts.filter((contact) => !selectedContacts.includes(contact.id)))
    setSelectedContacts([])
  }

  const toggleContactSelection = (id: string) => {
    setSelectedContacts((prev) => (prev.includes(id) ? prev.filter((contactId) => contactId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    setSelectedContacts(selectedContacts.length === filteredContacts.length ? [] : filteredContacts.map((c) => c.id))
  }

  const addCustomField = (isEditing = false) => {
    const newField = { name: "", value: "" }
    if (isEditing && editingContact) {
      setEditingContact({
        ...editingContact,
        customFields: [...editingContact.customFields, newField],
      })
    } else {
      setNewContact({
        ...newContact,
        customFields: [...newContact.customFields, newField],
      })
    }
  }

  const updateCustomField = (index: number, field: "name" | "value", value: string, isEditing = false) => {
    if (isEditing && editingContact) {
      const updatedFields = [...editingContact.customFields]
      updatedFields[index][field] = value
      setEditingContact({
        ...editingContact,
        customFields: updatedFields,
      })
    } else {
      const updatedFields = [...newContact.customFields]
      updatedFields[index][field] = value
      setNewContact({
        ...newContact,
        customFields: updatedFields,
      })
    }
  }

  const removeCustomField = (index: number, isEditing = false) => {
    if (isEditing && editingContact) {
      setEditingContact({
        ...editingContact,
        customFields: editingContact.customFields.filter((_, i) => i !== index),
      })
    } else {
      setNewContact({
        ...newContact,
        customFields: newContact.customFields.filter((_, i) => i !== index),
      })
    }
  }

  const getContactStats = () => {
    const total = contacts.length
    const online = contacts.filter((c) => c.status === "online").length
    const withEmail = contacts.filter((c) => c.email).length
    const vipClients = contacts.filter((c) => c.tags.includes("Cliente VIP")).length

    return { total, online, withEmail, vipClients }
  }

  const stats = getContactStats()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Contatos</h1>
          <p className="text-gray-600">Gerencie todos os seus contatos do WhatsApp em um só lugar</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          {selectedContacts.length > 0 && (
            <Button variant="destructive" onClick={deleteSelectedContacts}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir ({selectedContacts.length})
            </Button>
          )}
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Contato</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-700 mb-4">Dados do contato</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Nome <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="Nome completo"
                      className="border-red-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={newContact.whatsapp}
                      onChange={(e) => setNewContact({ ...newContact, whatsapp: e.target.value })}
                      placeholder="5567999999999"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="source">Conexão Origem:</Label>
                  <Select
                    value={newContact.source}
                    onValueChange={(value) => setNewContact({ ...newContact, source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Informações adicionais</Label>
                  <div className="space-y-3 mt-2">
                    {newContact.customFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-center">
                        <Input
                          placeholder="Nome do campo"
                          value={field.name}
                          onChange={(e) => updateCustomField(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Valor"
                          value={field.value}
                          onChange={(e) => updateCustomField(index, "value", e.target.value)}
                          className="col-span-3"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => addCustomField()} className="w-full text-sm" type="button">
                      + ADICIONAR INFORMAÇÃO
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addContact} className="bg-[#00183E] hover:bg-[#00183E]/90">
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-8 h-8 text-[#00183E]" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total de Contatos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.online}</p>
                <p className="text-sm text-gray-600">Online Agora</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.withEmail}</p>
                <p className="text-sm text-gray-600">Com Email</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge className="w-8 h-8 bg-yellow-500 text-white flex items-center justify-center">VIP</Badge>
              <div>
                <p className="text-2xl font-bold">{stats.vipClients}</p>
                <p className="text-sm text-gray-600">Clientes VIP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contatos ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedContacts.length === filteredContacts.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContactSelection(contact.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-[#00183E] text-white">{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.lastSeen}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{contact.whatsapp}</TableCell>
                  <TableCell>{contact.email || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${
                        contact.status === "online"
                          ? "bg-green-100 text-green-800"
                          : contact.status === "away"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status === "online" ? "Online" : contact.status === "away" ? "Ausente" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" title="WhatsApp">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingContact(contact)} title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteContact(contact.id)}
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
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-whatsapp">WhatsApp</Label>
                  <Input
                    id="edit-whatsapp"
                    value={editingContact.whatsapp}
                    onChange={(e) => setEditingContact({ ...editingContact, whatsapp: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingContact.email || ""}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Informações Personalizadas</Label>
                <div className="space-y-3 mt-2">
                  {editingContact.customFields.map((field, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-center">
                      <Input
                        placeholder="Nome do campo"
                        value={field.name}
                        onChange={(e) => updateCustomField(index, "name", e.target.value, true)}
                      />
                      <Input
                        placeholder="Valor"
                        value={field.value}
                        onChange={(e) => updateCustomField(index, "value", e.target.value, true)}
                        className="col-span-3"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(index, true)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addCustomField(true)}
                    className="w-full text-sm"
                    type="button"
                  >
                    + ADICIONAR INFORMAÇÃO
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingContact(null)}>
                  Cancelar
                </Button>
                <Button onClick={updateContact} className="bg-[#00183E] hover:bg-[#00183E]/90">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
