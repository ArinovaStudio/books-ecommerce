"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import AddProductDialog from "./AddProduct"

type PlanType = "basic" | "medium" | "advanced"

interface Product {
    id: string
    type: "textbook" | "notebook" | "stationary"
    planType: PlanType
    classes?: string
    productName: string
    brandName: string
    image: string | File
    price: number
}

const products: Product[] = [
    //  TEXTBOOKS
    { id: "tb-basic-1", type: "textbook", planType: "basic", productName: "Mathematics Grade 10", classes: "10", brandName: "NCERT", image: "https://m.media-amazon.com/images/I/81ZV9J0tZUL.jpg", price: 299 },
    { id: "tb-medium-1", type: "textbook", planType: "medium", productName: "Science Grade 10", classes: "10", brandName: "NCERT", image: "https://m.media-amazon.com/images/I/81N7FmJhbhL.jpg", price: 349 },
    { id: "tb-advanced-1", type: "textbook", planType: "advanced", productName: "English Literature", classes: "10", brandName: "Oxford", image: "https://m.media-amazon.com/images/I/71xU8SxN7jL.jpg", price: 399 },
    // NOTEBOOKS
    { id: "nb-basic-1", type: "notebook", planType: "basic", productName: "A4 Ruled Notebook", brandName: "Classmate", image: "https://m.media-amazon.com/images/I/71f8n9cFZOL.jpg", price: 60 },
    { id: "nb-medium-1", type: "notebook", planType: "medium", productName: "Spiral Notebook", brandName: "Navneet", image: "https://m.media-amazon.com/images/I/61p7zZy7JUL.jpg", price: 90 },
    { id: "nb-advanced-1", type: "notebook", planType: "advanced", productName: "Hardcover Notebook", brandName: "Paperkraft", image: "https://m.media-amazon.com/images/I/71ZrX0z8JOL.jpg", price: 150 },
    // STATIONARY
    { id: "st-basic-1", type: "stationary", planType: "basic", productName: "Ball Pen Pack (10 pcs)", brandName: "Cello", image: "https://m.media-amazon.com/images/I/71XqkF2wZOL.jpg", price: 120 },
    { id: "st-medium-1", type: "stationary", planType: "medium", productName: "Exam Writing Kit", brandName: "Reynolds", image: "https://m.media-amazon.com/images/I/61u0zVZ5hUL.jpg", price: 199 },
    { id: "st-advanced-1", type: "stationary", planType: "advanced", productName: "Premium Geometry Box", brandName: "Camlin", image: "https://m.media-amazon.com/images/I/71y3g9n8HVL.jpg", price: 249 },
]

const GRID_STYLE = "grid grid-cols-[80px_1fr_120px_100px_100px] gap-4 items-center"

export default function ProductTable({ planType = "basic" }: { planType?: PlanType }) {

    const handleAddProduct = (product: Product) => {
        console.log(product);
    }

    const renderRow = (product: Product) => (
        <div
            key={product.id}
            className={`${GRID_STYLE} px-6 py-4 hover:bg-muted/30 transition-colors border-b last:border-0`}
        >
            {/* Image Column */}
            <div className="flex justify-start">
                <img
                    src={product.image}
                    alt={product.productName}
                    className="w-12 h-12 object-cover rounded-md border shadow-sm bg-white"
                />
            </div>

            {/* Product Column */}
            <div className="flex flex-col">
                <span className="font-medium text-sm text-foreground leading-none">
                    {product.productName}
                </span>
            </div>

            {/* Brand Column */}
            <div className="flex justify-center">
                <Badge variant="secondary" className="font-normal text-[11px] uppercase tracking-wider">
                    {product.brandName}
                </Badge>
            </div>

            {/* Price Column */}
            <div className="text-right">
                <span className="font-bold text-sm">₹{product.price}</span>
            </div>

            {/* Action Column */}
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 cursor-pointer"
                // onClick={() => handleDelete(product.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )

    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pb-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold tracking-tight">Included Items</CardTitle>
                    <AddProductDialog onAdd={handleAddProduct} />
                </div>
            </CardHeader>

            <CardContent className="px-0">
                <Tabs defaultValue="textbook" className="w-full">
                    <TabsList className="mb-6 bg-muted/50 p-1">
                        <TabsTrigger value="textbook" className="px-6 cursor-pointer">Textbooks</TabsTrigger>
                        <TabsTrigger value="notebook" className="px-6 cursor-pointer">Notebooks</TabsTrigger>
                        <TabsTrigger value="stationary" className="px-6 cursor-pointer">Stationary</TabsTrigger>
                    </TabsList>

                    {(["textbook", "notebook", "stationary"] as const).map((category) => (
                        <TabsContent key={category} value={category} className="mt-0 ring-offset-background focus-visible:outline-none">
                            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                                {/* Table Header */}
                                <div className={`${GRID_STYLE} bg-muted/50 px-6 py-3 border-b`}>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Preview</span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Product Name</span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">Brand</span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right">Price</span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right">Action</span>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-border">
                                    {products
                                        .filter(p => p.type === category && p.planType === planType)
                                        .map(renderRow)
                                    }

                                    {/* Empty State */}
                                    {products.filter(p => p.type === category && p.planType === planType).length === 0 && (
                                        <div className="py-12 text-center text-sm text-muted-foreground">
                                            No {category} items found for this plan.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    )
}