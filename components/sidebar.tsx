"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Zap,
  CheckSquare,
  Users,
  Calendar,
  Tag,
  MessageCircle,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  Megaphone,
  List,
  FileText,
  Bot,
  Puzzle,
  LinkIcon,
  Archive,
  UsersIcon,
  DollarSign,
  Cog,
  Info,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [isAdminOpen, setIsAdminOpen] = useState(true)
  const [isCampanhasOpen, setIsCampanhasOpen] = useState(false)

  const mainItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Atendimentos", href: "/atendimentos", icon: MessageSquare },
    { name: "Kanban", href: "/kanban", icon: Kanban },
    { name: "Respostas Rápidas", href: "/respostas-rapidas", icon: Zap },
    { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
    { name: "Contatos", href: "/contatos", icon: Users },
    { name: "Agendamentos", href: "/agendamentos", icon: Calendar },
    { name: "Tags", href: "/tags", icon: Tag },
    { name: "Chat Interno", href: "/chat-interno", icon: MessageCircle },
    { name: "Ajuda", href: "/ajuda", icon: HelpCircle },
  ]

  const adminItems = [
    {
      name: "Campanhas",
      icon: Megaphone,
      isCollapsible: true,
      isOpen: isCampanhasOpen,
      onToggle: () => setIsCampanhasOpen(!isCampanhasOpen),
      subItems: [
        { name: "Listagem", href: "/campanhas", icon: List },
        { name: "Listas de Contatos", href: "/campanhas/listas-de-contatos", icon: Users },
        { name: "Configurações", href: "/campanhas/configuracoes", icon: Settings },
        { name: "Informativos", href: "/campanhas/informativos", icon: FileText },
      ],
    },
    { name: "Informativos", href: "/informativos", icon: Info },
    { name: "Open AI", href: "/open-ai", icon: Bot },
    { name: "Integrações", href: "/integracoes", icon: Puzzle },
    { name: "Conexões", href: "/conexoes", icon: LinkIcon },
    { name: "Lista de arquivos", href: "/lista-de-arquivos", icon: Archive },
    { name: "Filas & Chatbot", href: "/filas-chatbot", icon: MessageCircle },
    { name: "Usuários", href: "/usuarios", icon: UsersIcon },
    { name: "API", href: "/api", icon: Cog },
    { name: "Financeiro", href: "/financeiro", icon: DollarSign },
    { name: "Configurações", href: "/configuracoes", icon: Settings },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#00183E] rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#00183E]">MillionZAP</h1>
            <p className="text-xs text-gray-500">ERP Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {mainItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href ? "bg-[#00183E] text-white" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <div className="px-3 mb-2">
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Settings className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">Administração</span>
              {isAdminOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {isAdminOpen && (
            <div className="space-y-1 px-3">
              {adminItems.map((item) => (
                <div key={item.name}>
                  {item.isCollapsible ? (
                    <>
                      <button
                        onClick={item.onToggle}
                        className="flex items-center w-full px-6 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      {item.isOpen && item.subItems && (
                        <div className="space-y-1 mt-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={cn(
                                "flex items-center px-9 py-2 text-sm font-medium rounded-md transition-colors",
                                pathname === subItem.href
                                  ? "bg-[#00183E] text-white"
                                  : "text-gray-600 hover:bg-gray-100",
                              )}
                            >
                              <subItem.icon className="mr-3 h-3 w-3" />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-6 py-2 text-sm font-medium rounded-md transition-colors",
                        pathname === item.href ? "bg-[#00183E] text-white" : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">Versão: 5.2.1</p>
      </div>
    </div>
  )
}
