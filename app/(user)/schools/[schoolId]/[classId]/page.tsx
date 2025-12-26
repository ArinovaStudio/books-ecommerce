"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import  ProductTables  from "@/components/product-tables"
import { GuardianForm } from "@/components/guardian-form"
import { cn } from "@/lib/utils"
import { Globe, Rocket, Zap, X, ArrowRight } from "lucide-react"
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
  const [showGuardianForm, setShowGuardianForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  const handleCardClick = (planId: PlanType) => {
    setExpandedPlan(expandedPlan === planId ? null : planId)
  }

  const handleNextClick = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setShowGuardianForm(true)
    window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
  }

  const handleBackToPricing = () => {
    setShowGuardianForm(false)
  }

  if (showGuardianForm && selectedPlan) {
    return (
      <GuardianForm
        planName={selectedPlan.name}
        planPrice={`${selectedPlan.price}${selectedPlan.priceDetail}`}
        onBack={handleBackToPricing}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-left mb-6 sm:mb-8 lg:mb-10">
          Choose Your Plans
        </h1>

        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch transition-all duration-500 ease-in-out">
              {plans.map((plan) => {
                const Icon = plan.icon
                const isExpanded = expandedPlan === plan.id
                const isHidden = expandedPlan !== null && expandedPlan !== plan.id

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "relative overflow-hidden bg-card border-border cursor-pointer",
                      "transition-[flex-grow,opacity] duration-500 ease-in-out",
                      "md:flex",

                      plan.popular && "border-t-4 border-t-primary",

                      // default
                      !expandedPlan && "md:flex-1",

                      // expanded
                      isExpanded && "md:flex-3 cursor-default",

                      // hidden cards
                      isHidden && "hidden md:flex md:flex-0 md:opacity-0",

                      "w-full md:w-auto",
                    )}
                    onClick={() => !isExpanded && handleCardClick(plan.id)}
                  >
                    {plan.popular && (
                      <Badge
                        className={cn(
                          "absolute top-2 sm:top-3 right-4 sm:right-6 bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium transition-opacity duration-300 z-10",
                          isHidden && "opacity-0",
                        )}
                      >
                        POPULAR
                      </Badge>
                    )}

                    <CardContent className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
                      {/* COLLAPSED VIEW */}
                      <div
                        className={cn(
                          "transition-all duration-300",
                          isExpanded && "opacity-0 h-0 overflow-hidden",
                          isHidden && "opacity-0",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
                            plan.popular ? "bg-primary/10" : "bg-muted",
                          )}
                        >
                          <Icon
                            className={cn("w-5 h-5 sm:w-6 sm:h-6", plan.popular ? "text-primary" : "text-foreground")}
                          />
                        </div>

                        <div className="space-y-1 sm:space-y-1.5 mt-4 sm:mt-5 lg:mt-6">
                          <h3 className="text-base sm:text-lg font-semibold">{plan.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
                        </div>

                        <div className="space-y-0.5 sm:space-y-1 mt-4 sm:mt-5 lg:mt-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
                              {plan.price}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{plan.priceDetail}</p>
                        </div>

                        <Button
                          className={cn(
                            "w-full mt-4 sm:mt-5 lg:mt-6 cursor-pointer text-sm sm:text-base",
                            plan.buttonVariant === "default" &&
                              "bg-primary hover:bg-primary/90 text-primary-foreground",
                            plan.buttonVariant === "secondary" && "bg-primary/10 hover:bg-primary/20 text-primary",
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

                      {/* EXPANDED VIEW */}
                      {isExpanded && (
                        <div className="animate-in fade-in duration-500 delay-200">
                          <div className="flex items-start justify-between mb-4 sm:mb-5 lg:mb-6 gap-3 sm:gap-4">
                            <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                              </div>
                              <div className="space-y-0.5 sm:space-y-1">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">{plan.name}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">{plan.description}</p>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="bg-gray-50 hover:bg-gray-100 cursor-pointer shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                              onClick={() => setExpandedPlan(null)}
                            >
                              <X className="text-black h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </div>

                          <ProductTables planType={plan.id} />

                          <div className="flex justify-end mt-4 sm:mt-6 lg:mt-8">
                            <Button
                              className="mr-6 bg-amber-400 hover:bg-amber-300 text-black gap-1.5 sm:gap-2 text-sm sm:text-base px-4 sm:px-6 cursor-pointer"
                              onClick={() => handleNextClick(plan)}
                            >
                              Next <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
