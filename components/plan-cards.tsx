"use client"

import { Check, Crown, Gem, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  name: string
  displayName: string
  description: string
  price: number
  features: string[]
  maxUsers: number
  maxQueues: number
  isPopular: boolean
}

interface PlanCardsProps {
  plans: Plan[]
  selectedPlanId: string
  onSelectPlan: (planId: string) => void
}

const planIcons = {
  ouro: Star,
  safira: Gem,
  diamante: Crown,
}

const planColors = {
  ouro: {
    icon: "text-yellow-500",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    selected: "border-yellow-500 bg-yellow-50",
  },
  safira: {
    icon: "text-blue-500",
    border: "border-blue-200",
    bg: "bg-blue-50",
    selected: "border-blue-500 bg-blue-50",
  },
  diamante: {
    icon: "text-purple-500",
    border: "border-purple-200",
    bg: "bg-purple-50",
    selected: "border-purple-500 bg-purple-50",
  },
}

export function PlanCards({ plans, selectedPlanId, onSelectPlan }: PlanCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const Icon = planIcons[plan.name as keyof typeof planIcons]
        const colors = planColors[plan.name as keyof typeof planColors]
        const isSelected = selectedPlanId === plan.id

        return (
          <Card
            key={plan.id}
            className={cn(
              "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
              isSelected
                ? `${colors.selected} ring-2 ring-offset-2 ring-current`
                : `${colors.border} hover:${colors.bg}`,
              plan.isPopular && "ring-2 ring-emerald-500 ring-offset-2",
            )}
            onClick={() => onSelectPlan(plan.id)}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white px-3 py-1">Mais Popular</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={cn("p-3 rounded-full", colors.bg)}>
                  <Icon className={cn("h-8 w-8", colors.icon)} />
                </div>
              </div>

              <CardTitle className="text-xl font-bold text-gray-900">{plan.displayName}</CardTitle>

              <CardDescription className="text-gray-600">{plan.description}</CardDescription>

              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">R$ {plan.price}</span>
                <span className="text-gray-600">/mês</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Usuários:</span>
                  <span className="font-semibold">{plan.maxUsers === 999 ? "Ilimitados" : `Até ${plan.maxUsers}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Filas:</span>
                  <span className="font-semibold">
                    {plan.maxQueues === 999 ? "Ilimitadas" : `Até ${plan.maxQueues}`}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-800">Plano Selecionado</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
