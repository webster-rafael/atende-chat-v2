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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Dados de login:", data)

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à Milliontech.",
      })

      // Redirecionar para dashboard
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
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
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Bem-vindo de volta!</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Milliontech, o sistema que faltava para você ter mais{" "}
              <span className="text-yellow-400 font-semibold">LUCRO</span> e{" "}
              <span className="text-emerald-400 font-semibold">LIBERDADE</span>!
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <Image src="/milliontech-icon.png" alt="Milliontech Icon" width={200} height={200} className="opacity-80" />
          </div>
          <p className="text-blue-300 text-center text-sm">2025 © Milliontech</p>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="lg:hidden mb-6">
                <Image src="/milliontech-logo.png" alt="Milliontech" width={200} height={60} className="mx-auto" />
              </div>

              <CardTitle className="text-3xl font-bold text-gray-900">Login</CardTitle>
              <CardDescription className="text-gray-600 text-lg">Digite seu e-mail/usuário e senha</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="financeiro@genialoeg.com" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                              placeholder="••••••••"
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

                  <div className="flex items-center justify-between">
                    <div></div>
                    <Link href="/esqueceu-senha" className="text-sm text-gray-600 hover:text-emerald-600">
                      Esqueceu a Senha?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center pt-6 border-t">
                <p className="text-gray-600">
                  Não tem uma conta?{" "}
                  <Link
                    href="/cadastro"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                  >
                    Criar Conta
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
