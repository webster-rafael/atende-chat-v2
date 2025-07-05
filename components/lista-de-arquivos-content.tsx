"use client"

import type React from "react"

import { useState } from "react"
import { Search, Archive, Plus, Upload, X, Edit, Trash2, MoreHorizontal, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FileItem {
  id: string
  name: string
  size: string
  type: string
}

interface FileList {
  id: string
  name: string
  description: string
  message: string
  files: FileItem[]
  createdAt: string
  totalFiles: number
  totalSize: string
}

export function ListaDeArquivosContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    message: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])
  const [fileLists, setFileLists] = useState<FileList[]>([
    {
      id: "1",
      name: "Documentos Comerciais",
      description: "Contratos, propostas e documentos para vendas",
      message: "Segue em anexo os documentos solicitados. Qualquer dúvida, estou à disposição!",
      files: [
        { id: "1", name: "contrato-modelo.pdf", size: "2.5 MB", type: "PDF" },
        { id: "2", name: "proposta-comercial.docx", size: "1.8 MB", type: "DOCX" },
      ],
      createdAt: "2024-01-15",
      totalFiles: 2,
      totalSize: "4.3 MB",
    },
    {
      id: "2",
      name: "Manuais de Produto",
      description: "Manuais e guias de uso dos produtos",
      message: "Aqui estão os manuais dos nossos produtos. Esperamos que sejam úteis!",
      files: [
        { id: "3", name: "manual-usuario.pdf", size: "5.2 MB", type: "PDF" },
        { id: "4", name: "guia-instalacao.pdf", size: "3.1 MB", type: "PDF" },
        { id: "5", name: "video-tutorial.mp4", size: "15.7 MB", type: "MP4" },
      ],
      createdAt: "2024-01-10",
      totalFiles: 3,
      totalSize: "24.0 MB",
    },
    {
      id: "3",
      name: "Catálogos",
      description: "Catálogos de produtos e serviços",
      message: "Confira nosso catálogo completo com todos os produtos disponíveis.",
      files: [{ id: "6", name: "catalogo-2024.pdf", size: "8.9 MB", type: "PDF" }],
      createdAt: "2024-01-08",
      totalFiles: 1,
      totalSize: "8.9 MB",
    },
  ])

  const filteredFileLists = fileLists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    const newFileList: FileList = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      message: formData.message,
      files: uploadedFiles,
      createdAt: new Date().toISOString().split("T")[0],
      totalFiles: uploadedFiles.length,
      totalSize: calculateTotalSize(uploadedFiles),
    }

    setFileLists([newFileList, ...fileLists])
    setIsModalOpen(false)
    resetForm()
  }

  const calculateTotalSize = (files: FileItem[]): string => {
    // Simulação do cálculo de tamanho total
    const totalMB = files.reduce((acc, file) => {
      const size = Number.parseFloat(file.size.replace(/[^\d.]/g, ""))
      return acc + size
    }, 0)
    return `${totalMB.toFixed(1)} MB`
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", message: "" })
    setUploadedFiles([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: FileItem[] = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId))
  }

  const deleteFileList = (listId: string) => {
    setFileLists(fileLists.filter((list) => list.id !== listId))
  }

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800"
      case "docx":
      case "doc":
        return "bg-blue-100 text-blue-800"
      case "xlsx":
      case "xls":
        return "bg-green-100 text-green-800"
      case "mp4":
      case "avi":
        return "bg-purple-100 text-purple-800"
      case "jpg":
      case "png":
      case "jpeg":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#00183E] rounded-lg">
              <Archive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lista de arquivos ({fileLists.length})</h1>
              <p className="text-sm text-gray-500">Gerencie listas de arquivos para envio automático</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-[#00183E] hover:bg-[#00183E]/90">
              ADICIONAR
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {filteredFileLists.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Archive className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Nenhuma lista encontrada" : "Nenhuma lista de arquivos"}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm
                  ? "Tente ajustar sua pesquisa ou criar uma nova lista"
                  : "Crie sua primeira lista de arquivos para começar"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsModalOpen(true)} className="bg-[#00183E] hover:bg-[#00183E]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeira lista
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Arquivos</TableHead>
                  <TableHead>Tamanho Total</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFileLists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#00183E]/10 rounded-lg">
                          <Archive className="w-4 h-4 text-[#00183E]" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{list.name}</div>
                          <div className="text-sm text-gray-500">
                            {list.totalFiles} arquivo{list.totalFiles !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate">{list.description}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{list.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {list.files.slice(0, 3).map((file) => (
                          <span
                            key={file.id}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(file.type)}`}
                          >
                            {file.type}
                          </span>
                        ))}
                        {list.files.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{list.files.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{list.totalSize}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{new Date(list.createdAt).toLocaleDateString("pt-BR")}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
                              <Download className="w-4 h-4 mr-2" />
                              Baixar todos
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => deleteFileList(list.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar lista de arquivos</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da lista de arquivos *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Documentos Comerciais"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detalhes da lista</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o conteúdo desta lista de arquivos..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lista de arquivos</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem para enviar com arquivo
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Digite a mensagem que será enviada junto com os arquivos..."
                      rows={3}
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">+ ADICIONAR ARQUIVO</span>
                          <span className="mt-1 block text-xs text-gray-500">
                            Clique para selecionar arquivos ou arraste aqui
                          </span>
                        </label>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Arquivos selecionados ({uploadedFiles.length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(file.type)}`}
                              >
                                {file.type}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{file.size}</p>
                              </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
              >
                CANCELAR
              </Button>
              <Button type="submit" className="bg-[#00183E] hover:bg-[#00183E]/90">
                SALVAR
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
