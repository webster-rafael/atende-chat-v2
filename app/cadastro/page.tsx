"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { PlanCards } from "@/components/plan-cards"
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth"

// Dados estáticos dos planos
const staticPlans = [
  {
    id: "1",
    name: "ouro",
    displayName: "Plano Ouro",
    description: "Ideal para pequenas empresas",
    price: 97,
    features: [
      "WhatsApp Business API",
      "Atendimento multiusuário",
      "Chatbot básico",
      "Relatórios essenciais",
      "Suporte por email",
    ],
    maxUsers: 3,
    maxQueues: 2,
    isPopular: false,
  },
  {
    id: "2",
    name: "safira",
    displayName: "Plano Safira",
    description: "Perfeito para empresas em crescimento",
    price: 197,
    features: [
      "Tudo do Plano Ouro",
      "Chatbot avançado com IA",
      "Integração com CRM",
      "Relatórios avançados",
      "Campanhas de marketing",
      "Suporte prioritário",
    ],
    maxUsers: 10,
    maxQueues: 5,
    isPopular: true,
  },
  {
    id: "3",
    name: "diamante",
    displayName: "Plano Diamante",
    description: "Solução completa para grandes empresas",
    price: 397,
    features: [
      "Tudo do Plano Safira",
      "Usuários ilimitados",
      "Filas ilimitadas",
      "API personalizada",
      "Integrações customizadas",
      "Suporte 24/7 dedicado",
      "Treinamento personalizado",
    ],
    maxUsers: 999,
    maxQueues: 999,
    isPopular: false,
  },
]

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      planId: "",
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Encontrar o plano selecionado
      const selectedPlan = staticPlans.find((plan) => plan.id === data.planId)

      console.log("Dados do cadastro:", {
        ...data,
        selectedPlan: selectedPlan?.displayName,
      })

      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo à Milliontech! Plano ${selectedPlan?.displayName} selecionado.`,
      })

      // Redirecionar para dashboard após sucesso
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Informações da Empresa */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <Image src="/milliontech-logo.png" alt="Milliontech" width={280} height={80} className="h-12 w-auto" />
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Bem-vindo à revolução do atendimento!</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Milliontech, o sistema que faltava para você ter mais{" "}
              <span className="text-yellow-400 font-semibold">LUCRO</span> e{" "}
              <span className="text-emerald-400 font-semibold">LIBERDADE</span>!
            </p>

            <div className="space-y-4 text-blue-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                <span>WhatsApp Business API integrado</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Atendimento multiusuário inteligente</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Chatbot com inteligência artificial</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>Relatórios e métricas avançadas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <Image src="/milliontech-icon.png" alt="Milliontech Icon" width={200} height={200} className="opacity-80" />
          </div>
          <p className="text-blue-300 text-center text-sm">2025 © Milliontech - Tecnologia que transforma negócios</p>
        </div>
      </div>

      {/* Lado Direito - Formulário de Cadastro */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-2xl">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="lg:hidden mb-6">
                <Image src="/milliontech-logo.png" alt="Milliontech" width={200} height={60} className="mx-auto" />
              </div>

              <CardTitle className="text-3xl font-bold text-gray-900">Criar Conta</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Preencha os dados para começar sua jornada
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Dados da Empresa */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados da Empresa</h3>

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o nome da sua empresa" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Corporativo</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="empresa@exemplo.com" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Segurança</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Digite sua senha"
                                  {...field}
                                  className="h-12 pr-12"
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirme sua senha"
                                  {...field}
                                  className="h-12 pr-12"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Seleção de Plano */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Escolha seu Plano</h3>

                    <FormField
                      control={form.control}
                      name="planId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PlanCards plans={staticPlans} selectedPlanId={field.value} onSelectPlan={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Termos e Condições */}
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            Aceito os{" "}
                            <Link href="/termos" className="text-emerald-600 hover:underline">
                              Termos de Uso
                            </Link>{" "}
                            e{" "}
                            <Link href="/privacidade" className="text-emerald-600 hover:underline">
                              Política de Privacidade
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Botão de Cadastro */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </Form>

              {/* Link para Login */}
              <div className="text-center pt-6 border-t">
                <p className="text-gray-600">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                    Fazer Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
