"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Users, Search, Plus, Edit, Trash2, Eye, EyeOff, AlertTriangle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  profile: "admin" | "manager" | "user"
  queues: string[]
  defaultConnection: string
  createdAt: string
  lastLogin: string
}

export function UsuariosContent() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Webster",
      email: "webster@admin.com",
      profile: "user",
      queues: ["Suporte", "Vendas"],
      defaultConnection: "WhatsApp Principal",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20 14:30",
    },
    {
      id: "2",
      name: "Admin",
      email: "admin@admin.com",
      profile: "admin",
      queues: ["Todas"],
      defaultConnection: "WhatsApp Principal",
      createdAt: "2024-01-01",
      lastLogin: "2024-01-20 16:45",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile: "user" as "admin" | "manager" | "user",
    queues: [] as string[],
    defaultConnection: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      password: "",
      profile: "user",
      queues: [],
      defaultConnection: "",
    })
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      profile: user.profile,
      queues: user.queues,
      defaultConnection: user.defaultConnection,
    })
    setIsModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      toast({
        title: "Usuário excluído",
        description: `O usuário "${userToDelete.name}" foi excluído com sucesso.`,
      })
    }
    setDeleteConfirmOpen(false)
    setUserToDelete(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                profile: formData.profile,
                queues: formData.queues,
                defaultConnection: formData.defaultConnection,
              }
            : user,
        ),
      )
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      })
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        profile: formData.profile,
        queues: formData.queues,
        defaultConnection: formData.defaultConnection,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "Nunca",
      }
      setUsers([...users, newUser])
      toast({
        title: "Usuário criado",
        description: "O novo usuário foi criado com sucesso.",
      })
    }

    setIsModalOpen(false)
  }

  const getProfileBadge = (profile: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800 border-red-200",
      manager: "bg-blue-100 text-blue-800 border-blue-200",
      user: "bg-green-100 text-green-800 border-green-200",
    }

    const labels = {
      admin: "Administrador",
      manager: "Gerente",
      user: "Usuário",
    }

    return (
      <Badge className={variants[profile as keyof typeof variants]}>{labels[profile as keyof typeof labels]}</Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            </div>
            <p className="text-gray-600 mt-1">Gerencie os usuários do sistema</p>
          </div>
          <Button onClick={handleAddUser} className="bg-[#00183E] hover:bg-[#00183E]/90">
            <Plus className="h-4 w-4 mr-2" />
            ADICIONAR USUÁRIO
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>
                  {users.length} usuário{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            Criado em {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{user.email}</div>
                        <div className="text-sm text-gray-500">Último login: {user.lastLogin}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getProfileBadge(user.profile)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Tente ajustar sua pesquisa" : "Comece adicionando um novo usuário"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Adicionar/Editar Usuário */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar usuário" : "Adicionar usuário"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Edite as informações do usuário" : "Preencha as informações do novo usuário"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                      placeholder={editingUser ? "••••••" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile">Perfil</Label>
                  <Select
                    value={formData.profile}
                    onValueChange={(value: "admin" | "manager" | "user") =>
                      setFormData({ ...formData, profile: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="queues">Filas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as filas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suporte">Suporte</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="connection">Conexão Padrão</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conexão padrão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp1">WhatsApp Principal</SelectItem>
                    <SelectItem value="whatsapp2">WhatsApp Secundário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  CANCELAR
                </Button>
                <Button type="submit" className="bg-[#00183E] hover:bg-[#00183E]/90">
                  {editingUser ? "SALVAR" : "ADICIONAR"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o usuário "{userToDelete?.name}"?
                <br />
                <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
