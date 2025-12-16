"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductTables } from "@/components/product-tables"
import { cn } from "@/lib/utils"
import { Check, Globe, Rocket, Zap, X,ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type PlanType = "basic" | "medium" | "advanced"

interface PricingPlan {
  id: PlanType
  name: string
  description: string
  price: string
  priceDetail: string
  popular: boolean
  icon: React.ElementType
  buttonVariant: "outline" | "default" | "secondary"
}

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "BASIC",
    description: "Learn fundamentals with simple concepts.",
    price: "₹999",
    priceDetail: "/month",
    popular: false,
    icon: Globe,
    buttonVariant: "outline",
  },
  {
    id: "medium",
    name: "MEDIUM",
    description: "Build skills with guided practice.",
    price: "₹1,999",
    priceDetail: "/month",
    popular: true,
    icon: Rocket,
    buttonVariant: "default",
  },
  {
    id: "advanced",
    name: "ADVANCED",
    description: "Master advanced topics with projects.",
    price: "₹2,999",
    priceDetail: "/month",
    popular: false,
    icon: Zap,
    buttonVariant: "secondary",
  },

]

export default function PricingCards() {
  const [expandedPlan, setExpandedPlan] = useState<PlanType | null>(null)

  const handleCardClick = (planId: PlanType) => {
    setExpandedPlan(expandedPlan === planId ? null : planId)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <h1 className="text-4xl font-semibold text-left mb-10">
          Choose Your PLans
        </h1>

        <div className="flex flex-col gap-8 pt-5">
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              {plans.map((plan) => {
                const Icon = plan.icon
                const isExpanded = expandedPlan === plan.id
                const isHidden = expandedPlan !== null && expandedPlan !== plan.id

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "relative overflow-hidden bg-card border-border transition-all duration-500 ease-in-out",

                      "md:flex",
                      plan.popular && "border-t-4 border-t-primary",
                      !expandedPlan && "md:flex-1",
                      isExpanded && "md:flex-3",
                      isHidden && "md:flex-0 md:opacity-0 md:pointer-events-none",

                      "w-full md:w-auto"
                    )}
                    onClick={() => !isExpanded && handleCardClick(plan.id)}
                  >
                    {plan.popular && (
                      <Badge
                        className={cn(
                          "absolute top-3 right-6 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium transition-opacity duration-300 z-10",
                          isHidden && "opacity-0",
                        )}
                      >
                        POPULAR
                      </Badge>
                    )}

                    <CardContent className="p-6 space-y-6">
                      {/* COLLAPSED VIEW */}
                      <div
                        className={cn(
                          "transition-all duration-300",
                          isExpanded && "md:opacity-0 md:h-0 md:overflow-hidden",
                          isHidden && "opacity-0",
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            plan.popular ? "bg-primary/10" : "bg-muted",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-6 h-6",
                              plan.popular ? "text-primary" : "text-foreground"
                            )}
                          />
                        </div>

                        <div className="space-y-1 mt-6">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {plan.description}
                          </p>
                        </div>

                        <div className="space-y-1 mt-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-normal tracking-tight">
                              {plan.price}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {plan.priceDetail}
                          </p>
                        </div>

                        <Button
                          className={cn(
                            "w-full mt-6 cursor-pointer",
                            plan.buttonVariant === "default" &&
                            "bg-primary hover:bg-primary/90 text-primary-foreground",
                            plan.buttonVariant === "secondary" &&
                            "bg-primary/10 hover:bg-primary/20 text-primary",
                            plan.buttonVariant === "outline" &&
                            "bg-muted hover:bg-muted/80 text-muted-foreground border-0",
                          )}
                          variant={plan.buttonVariant}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCardClick(plan.id)
                          }}
                        >
                          View Details
                        </Button>
                      </div>

                      {isExpanded && (
                        <div className="animate-in fade-in duration-500 delay-200">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-6">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-semibold mb-1">
                                  {plan.name}
                                </h3>
                                <p className="text-muted-foreground">
                                  {plan.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setExpandedPlan(null)}
                            >
                              <X className="text-black" />
                            </Button>
                          </div>

                          <ProductTables planType={plan.id} />
                          <div className="flex justify-end mt-8">
                            <Button
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => {
                                // add your next-step logic here
                                console.log("Next clicked for plan:", plan.id)
                              }}
                            >
                              Next <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}
