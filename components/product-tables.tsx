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

    const getQuantity = (productId: string) => {
        return quantities[productId] || 1
    }

    const updateQuantity = (productId: string, delta: number) => {
        setQuantities((prev) => {
            const current = prev[productId] || 1
            const newQuantity = Math.max(1, current + delta)
            return { ...prev, [productId]: newQuantity }
        })
    }

    const renderProductRow = (product: Product, isTextbook: boolean) => {
        const quantity = isTextbook ? product.fixedQuantity! : getQuantity(product.id)
        const discount = (((product.actualPrice - product.discountedPrice) / product.actualPrice) * 100).toFixed(0)

        return (
            <div
                key={product.id}
                className="
    flex flex-col sm:flex-row sm:items-center
    gap-4 p-4 border-b last:border-b-0
    hover:bg-muted/50 transition-colors
    overflow-y-auto
  "
            >
                <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md border mx-auto sm:mx-0"
                />

                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h4 className="font-semibold text-base truncate">
                        {product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Save {discount}%
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        {isTextbook ? (
                            <div className="w-24 text-center">
                                <span className="text-sm font-medium">
                                    Qty: {quantity}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border rounded-md">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(product.id, -1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>

                                <span className="w-8 text-center text-sm font-medium">
                                    {quantity}
                                </span>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(product.id, 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="text-center sm:text-right min-w-[120px]">
                        <div className="font-bold text-lg">
                            ₹{product.discountedPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground line-through">
                            ₹{product.actualPrice.toFixed(2)}
                        </div>

                    </div>
                </div>
            </div>

        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {planType.toUpperCase()} Plan - Product Details
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="textbooks" className="w-full">

                    {/* Tabs */}
                    <TabsList className="w-full grid grid-cols-3 mb-6 overflow-x-auto">
                        <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
                        <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
                        <TabsTrigger value="stationary">Stationary</TabsTrigger>
                    </TabsList>

                    {/* TEXTBOOKS */}
                    <TabsContent value="textbooks" className="mt-0">
                        <div className="border rounded-lg overflow-hidden">

                            {/* Table Header (hidden on mobile) */}
                            <div className="hidden md:grid bg-muted/30 p-4 font-semibold grid-cols-[80px_1fr_160px_auto] gap-4 text-sm">
                                <span>Image</span>
                                <span>Product</span>
                                <span>Quantity</span>
                                <span className="text-right">Price</span>
                            </div>


                            {products.textbooks.map((product) =>
                                renderProductRow(product, true)
                            )}
                        </div>
                    </TabsContent>

                    {/* NOTEBOOKS */}
                    <TabsContent value="notebooks" className="mt-0">
                        <div className="border rounded-lg overflow-hidden">
                            <div className="hidden md:grid bg-muted/30 p-4 font-semibold grid-cols-[80px_1fr_auto_auto] gap-4 text-sm">
                                <span>Image</span>
                                <span>Product</span>
                                <span>Quantity</span>
                                <span className="text-right">Price</span>
                            </div>

                            {products.notebooks.map((product) =>
                                renderProductRow(product, false)
                            )}
                        </div>
                    </TabsContent>

                    {/* STATIONARY */}
                    <TabsContent value="stationary" className="mt-0">
                        <div className="border rounded-lg overflow-hidden">
                            <div className="hidden md:grid bg-muted/30 p-4 font-semibold grid-cols-[80px_1fr_auto_auto] gap-4 text-sm">
                                <span>Image</span>
                                <span>Product</span>
                                <span>Quantity</span>
                                <span className="text-right">Price</span>
                            </div>

                            {products.stationary.map((product) =>
                                renderProductRow(product, false)
                            )}
                        </div>
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>

    )
}
