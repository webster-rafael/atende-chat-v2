import { z } from "zod"

export const registerSchema = z
  .object({
    companyName: z
      .string()
      .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
      .max(100, "Nome da empresa deve ter no máximo 100 caracteres"),
    email: z.string().email("Digite um email válido").min(1, "Email é obrigatório"),
    phone: z
      .string()
      .min(10, "Telefone deve ter pelo menos 10 dígitos")
      .max(15, "Telefone deve ter no máximo 15 dígitos")
      .regex(/^[\d\s()+-]+$/, "Formato de telefone inválido"),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/\d/, "Senha deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    planId: z.string().min(1, "Selecione um plano"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email("Digite um email válido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
