"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Tag, Hash, Palette } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

interface TagData {
  id: string
  name: string
  color: string
  isKanban: boolean
  order: number
  taggedRecords: number
  createdAt: string
  updatedAt: string
  description?: string
}

const initialTags: TagData[] = [
  {
    id: "1",
    name: "Suporte",
    color: "#8B5CF6",
    isKanban: true,
    order: 1,
    taggedRecords: 15,
    createdAt: "2025-01-07",
    updatedAt: "2025-01-07",
    description: "Tags relacionadas ao suporte técnico",
  },
  {
    id: "2",
    name: "Vendas",
    color: "#10B981",
    isKanban: true,
    order: 2,
    taggedRecords: 23,
    createdAt: "2025-01-06",
    updatedAt: "2025-01-07",
    description: "Tags para processo de vendas",
  },
  {
    id: "3",
    name: "SDR",
    color: "#F59E0B",
    isKanban: true,
    order: 3,
    taggedRecords: 8,
    createdAt: "2025-01-05",
    updatedAt: "2025-01-06",
    description: "Sales Development Representative",
  },
  {
    id: "4",
    name: "Cliente VIP",
    color: "#EF4444",
    isKanban: false,
    order: 4,
    taggedRecords: 5,
    createdAt: "2025-01-04",
    updatedAt: "2025-01-05",
    description: "Clientes com prioridade especial",
  },
  {
    id: "5",
    name: "Prospect",
    color: "#3B82F6",
    isKanban: false,
    order: 5,
    taggedRecords: 12,
    createdAt: "2025-01-03",
    updatedAt: "2025-01-04",
    description: "Clientes em potencial",
  },
  {
    id: "6",
    name: "Follow-up",
    color: "#F97316",
    isKanban: false,
    order: 6,
    taggedRecords: 18,
    createdAt: "2025-01-02",
    updatedAt: "2025-01-03",
    description: "Acompanhamento de clientes",
  },
]

const predefinedColors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F43F5E", // Rose
]

export function TagsContent() {
  const [tags, setTags] = useState<TagData[]>(initialTags)
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [editingTag, setEditingTag] = useState<TagData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newTag, setNewTag] = useState({
    name: "",
    color: "#3B82F6",
    isKanban: false,
    order: 1,
    description: "",
  })

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addTag = () => {
    if (!newTag.name.trim()) return

    const tag: TagData = {
      id: Date.now().toString(),
      name: newTag.name,
      color: newTag.color,
      isKanban: newTag.isKanban,
      order: newTag.order,
      taggedRecords: 0,
      description: newTag.description,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setTags([...tags, tag])
    setNewTag({
      name: "",
      color: "#3B82F6",
      isKanban: false,
      order: tags.length + 1,
      description: "",
    })
    setIsAddingTag(false)
  }

  const updateTag = () => {
    if (!editingTag) return

    const updatedTags = tags.map((tag) =>
      tag.id === editingTag.id ? { ...editingTag, updatedAt: new Date().toISOString().split("T")[0] } : tag,
    )

    setTags(updatedTags)
    setEditingTag(null)
  }

  const deleteTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const getTagStats = () => {
    const total = tags.length
    const kanbanTags = tags.filter((t) => t.isKanban).length
    const totalRecords = tags.reduce((acc, t) => acc + t.taggedRecords, 0)
    const mostUsed = tags.reduce((prev, current) => (prev.taggedRecords > current.taggedRecords ? prev : current))

    return { total, kanbanTags, totalRecords, mostUsed }
  }

  const stats = getTagStats()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-600">Gerencie as tags do sistema e organize seus dados</p>
        </div>
        <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
          <DialogTrigger asChild>
            <Button className="bg-[#00183E] hover:bg-[#00183E]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="Digite o nome da tag"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  placeholder="Descrição da tag (opcional)"
                />
              </div>

              <div>
                <Label htmlFor="color">Cor</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: newTag.color }}
                    onClick={() => {
                      const colorInput = document.createElement("input")
                      colorInput.type = "color"
                      colorInput.value = newTag.color
                      colorInput.onchange = (e) => {
                        const target = e.target as HTMLInputElement
                        setNewTag({ ...newTag, color: target.value })
                      }
                      colorInput.click()
                    }}
                  />
                  <div className="flex flex-wrap gap-1">
                    {predefinedColors.map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTag({ ...newTag, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="kanban"
                  checked={newTag.isKanban}
                  onCheckedChange={(checked) => setNewTag({ ...newTag, isKanban: !!checked })}
                />
                <Label htmlFor="kanban">Kanban</Label>
                <span className="text-sm text-gray-500">(Criar coluna no Kanban)</span>
              </div>

              <div>
                <Label htmlFor="order">Ordem</Label>
                <Select
                  value={newTag.order.toString()}
                  onValueChange={(value) => setNewTag({ ...newTag, order: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: tags.length + 1 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingTag(false)}>
                  Cancelar
                </Button>
                <Button onClick={addTag} className="bg-[#00183E] hover:bg-[#00183E]/90">
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-8 h-8 text-[#00183E]" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total de Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Hash className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.kanbanTags}</p>
                <p className="text-sm text-gray-600">Tags Kanban</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
                <p className="text-sm text-gray-600">Registros Tagados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: stats.mostUsed.color }}
              >
                #
              </div>
              <div>
                <p className="text-lg font-bold truncate">{stats.mostUsed.name}</p>
                <p className="text-sm text-gray-600">Mais Utilizada</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tags ({filteredTags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Registros Tagados</TableHead>
                <TableHead>Kanban</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.color }} />
                      <div>
                        <p className="font-medium text-gray-900">{tag.name}</p>
                        {tag.description && <p className="text-sm text-gray-500">{tag.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: tag.color }} />
                      <span className="text-sm font-mono">{tag.color}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      {tag.taggedRecords}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tag.isKanban ? (
                      <Badge className="bg-green-100 text-green-800">Sim</Badge>
                    ) : (
                      <Badge variant="outline">Não</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tag.order}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingTag(tag)} title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTag(tag.id)}
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

          {filteredTags.length === 0 && (
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tag encontrada</h3>
              <p className="text-gray-500">Tente ajustar sua pesquisa ou criar uma nova tag.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tag</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Input
                  id="edit-description"
                  value={editingTag.description || ""}
                  onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-color">Cor</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: editingTag.color }}
                    onClick={() => {
                      const colorInput = document.createElement("input")
                      colorInput.type = "color"
                      colorInput.value = editingTag.color
                      colorInput.onchange = (e) => {
                        const target = e.target as HTMLInputElement
                        setEditingTag({ ...editingTag, color: target.value })
                      }
                      colorInput.click()
                    }}
                  />
                  <div className="flex flex-wrap gap-1">
                    {predefinedColors.map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingTag({ ...editingTag, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-kanban"
                  checked={editingTag.isKanban}
                  onCheckedChange={(checked) => setEditingTag({ ...editingTag, isKanban: !!checked })}
                />
                <Label htmlFor="edit-kanban">Kanban</Label>
              </div>

              <div>
                <Label htmlFor="edit-order">Ordem</Label>
                <Select
                  value={editingTag.order.toString()}
                  onValueChange={(value) => setEditingTag({ ...editingTag, order: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: tags.length }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingTag(null)}>
                  Cancelar
                </Button>
                <Button onClick={updateTag} className="bg-[#00183E] hover:bg-[#00183E]/90">
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
