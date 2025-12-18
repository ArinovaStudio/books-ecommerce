"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PlanType = "basic" | "medium" | "advanced"

interface Product {
    id: string
    name: string
    image: string
    discountedPrice: number
    actualPrice: number
    fixedQuantity?: number
}

/*  Single source of truth for grid columns */
const GRID_COLS = "sm:grid-cols-[80px_1fr_140px_140px]"

const products: Record<string, Product[]> = {
    textbooks: [
        {
            id: "tb1",
            name: "Mathematics Grade 10",
            image: "/math-textbook.png",
            discountedPrice: 29.99,
            actualPrice: 39.99,
            fixedQuantity: 1,
        },
        {
            id: "tb2",
            name: "Science Grade 10",
            image: "/science-textbook.jpg",
            discountedPrice: 34.99,
            actualPrice: 44.99,
            fixedQuantity: 1,
        },
        {
            id: "tb3",
            name: "English Literature",
            image: "/english-textbook.png",
            discountedPrice: 24.99,
            actualPrice: 34.99,
            fixedQuantity: 1,
        },
    ],
    notebooks: [
        {
            id: "nb1",
            name: "Ruled Notebook A4",
            image: "/ruled-notebook.jpg",
            discountedPrice: 4.99,
            actualPrice: 7.99,
        },
        {
            id: "nb2",
            name: "Graph Notebook",
            image: "/graph-notebook.jpg",
            discountedPrice: 5.99,
            actualPrice: 8.99,
        },
        {
            id: "nb3",
            name: "Spiral Notebook",
            image: "/spiral-notebook.jpg",
            discountedPrice: 6.99,
            actualPrice: 9.99,
        },
    ],
    stationary: [
        {
            id: "st1",
            name: "Pen Set (10 pcs)",
            image: "/elegant-pen-set.png",
            discountedPrice: 8.99,
            actualPrice: 12.99,
        },
        {
            id: "st2",
            name: "Pencil Set (12 pcs)",
            image: "/pencil-set.jpg",
            discountedPrice: 6.99,
            actualPrice: 9.99,
        },
        {
            id: "st3",
            name: "Eraser & Sharpener Kit",
            image: "/eraser-sharpener.jpg",
            discountedPrice: 3.99,
            actualPrice: 5.99,
        },
    ],
}

interface ProductTableProps {
    planType: PlanType
}

export function ProductTables({ planType }: ProductTableProps) {
    const [quantities, setQuantities] = useState<Record<string, number>>({})

    const getQuantity = (id: string) => quantities[id] || 1

    const updateQuantity = (id: string, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta),
        }))
    }

    const renderProductRow = (product: Product, isTextbook: boolean) => {
        const quantity = isTextbook ? product.fixedQuantity! : getQuantity(product.id)
        const discount = (((product.actualPrice - product.discountedPrice) / product.actualPrice) * 100).toFixed(0)

        return (
            <div
                key={product.id}
                className={`flex flex-col sm:grid ${GRID_COLS} sm:items-center gap-4 p-4 sm:p-5 border-b last:border-b-0 hover:bg-muted/50 transition-colors`}
            >
                {/* Image + Product */}
                <div className="flex items-center gap-4 sm:contents">
                    <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1">{product.name}</h4>

                        {/* Mobile price */}
                        <div className="flex items-baseline gap-2 sm:hidden">
                            <span className="font-bold text-lg">₹{product.discountedPrice.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">
                                ₹{product.actualPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-green-600 font-medium">-{discount}%</span>
                        </div>

                        <p className="hidden sm:block text-sm text-muted-foreground">Save {discount}%</p>
                    </div>
                </div>

                {/* Quantity */}
                <div className="sm:w-[140px] flex justify-between sm:justify-center items-center">
                    <span className="sm:hidden text-sm text-muted-foreground">Quantity:</span>

                    {isTextbook ? (
                        <span className="text-sm font-semibold">Qty: {quantity}</span>
                    ) : (
                        <div className="flex items-center gap-2 border rounded-lg bg-background shadow-sm">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9"
                                onClick={() => updateQuantity(product.id, -1)}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-10 text-center font-semibold tabular-nums">{quantity}</span>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9"
                                onClick={() => updateQuantity(product.id, 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="hidden sm:block text-right w-[140px]">
                    <div className="font-bold text-lg">₹{product.discountedPrice.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground line-through">
                        ₹{product.actualPrice.toFixed(2)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full flex-col border-none shadow-none">
            <CardHeader className="shrink-0">
                <CardTitle className="text-xl sm:text-2xl">
                    Product Details
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden">
                <Tabs defaultValue="textbooks" className="h-full flex flex-col">
                    <TabsList className="grid grid-cols-3 shrink-0 mb-4  w-full">
                        <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
                        <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
                        <TabsTrigger value="stationary">Stationary</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        {(["textbooks", "notebooks", "stationary"] as const).map((type) => (
                            <TabsContent key={type} value={type} className="mt-0">
                                <div className="border rounded-lg overflow-hidden">
                                    <div
                                        className={`hidden sm:grid bg-muted/30 p-5 font-semibold ${GRID_COLS} gap-6 text-sm sticky top-0 z-10`}
                                    >
                                        <span>Image</span>
                                        <span>Product</span>
                                        <span className="pl-10">Quantity</span>
                                        <span className="text-right">Price</span>
                                    </div>

                                    {products[type].map((p) =>
                                        renderProductRow(p, type === "textbooks")
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    )
}
