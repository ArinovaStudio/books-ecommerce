"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Trash2, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import AddEditProductDialog from "./AddProduct"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type Product = {
    id: string
    name: string
    description: string
    category: string
    class?: string
    stock: number
    brand: string
    price: number
    image: string
}

type PageProps = {
    role: string
    params: {
        schoolId: string
        classId: string
    }
    searchParams: {
        language?: string
    }
}

export default function ProductTable({ role, params, searchParams }: PageProps) {

    const { toast } = useToast()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const router = useRouter()

    const handleNextClick = async () => {
        const res = await fetch("/api/auth/check")
        const data = await res.json()

        if (data.authenticated) {
            const query = new URLSearchParams({
                schoolId: params.schoolId,
                classId: params.classId,
            }).toString()
            window.open(`/guardian-form?${query}`, "_blank")
        } else {
            setShowAuthModal(true)
        }
    }

    const isAdmin = role !== "USER"

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/products/filter", {
                method: "POST",
                body: JSON.stringify({
                    schoolId: params?.schoolId,
                    classId: params?.classId,
                }),
            })
            const data = await res.json()
            setProducts(data.success ? data.data : [])
        } catch (err) {
            console.error("Failed to fetch products", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            })
            const data = await res.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Product deleted successfully",
                })
                fetchProducts()
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete product",
                    variant: "destructive",
                })
            }
        } catch (err) {
            console.error("Delete failed", err)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        const total = products.reduce((sum, p) => sum + p.price, 0)
        setTotalPrice(total)
    }, [products])

    const groupedProducts = products.reduce((acc, product) => {
        const category = product.category.toUpperCase()
        if (!acc[category]) acc[category] = []
        acc[category].push(product)
        return acc
    }, {} as Record<string, Product[]>)

    const categoryTitles = {
        TEXTBOOK: "Textbooks",
        NOTEBOOK: "Notebooks",
        STATIONARY: "Stationary",
    }

    const renderRow = (product: Product) => (
        <div
            key={product.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-muted/30 transition border-b last:border-0"
        >
            {/* Image - 1 col */}
            <div className="md:col-span-1 flex justify-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-md object-cover border bg-white"
                />
            </div>

            {/* Name - 3 cols */}
            <div className="md:col-span-3 flex flex-col min-w-0">
                <span className="font-semibold text-sm truncate">
                    {product.name}
                </span>
                <div className="md:hidden mt-2 flex gap-2 text-xs">
                    <Badge variant="secondary" className="text-xs">{product.brand}</Badge>
                    <span className="text-muted-foreground">Stock: {product.stock}</span>
                </div>
            </div>

            {/* Brand - 2 cols */}
            <div className="hidden md:flex md:col-span-2 justify-center">
                <Badge variant="secondary" className="text-xs uppercase">
                    {product.brand}
                </Badge>
            </div>

            {/* Stock - 1 col */}
            <div className="hidden md:flex md:col-span-1 justify-center font-semibold text-sm text-muted-foreground">
                {product.stock}
            </div>

            {/* Description - 2 cols */}
            <div className="hidden md:flex md:col-span-2 justify-center text-muted-foreground text-sm">
                {product.description}
            </div>

            {/* Price - 2 cols */}
            <div className="md:col-span-2 flex justify-center md:justify-end">
                <span className="font-bold text-base">₹{product.price}</span>
            </div>

            {/* Actions - 1 col */}
            {isAdmin && (
                <div className="md:col-span-1 flex items-center justify-end gap-2">
                    {/* Delete */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete this product?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Edit */}
                    <AddEditProductDialog
                        product={product}
                        onSuccess={fetchProducts}
                        setProducts={setProducts}
                        trigger={
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        }
                    />
                </div>
            )}
        </div>
    )

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="flex flex-row justify-between items-center px-0">
                <CardTitle className="text-2xl font-bold">Included Items</CardTitle>
                {isAdmin && <AddEditProductDialog onSuccess={fetchProducts} setProducts={setProducts} />}
            </CardHeader>

            <CardContent className="px-0">
                <div className="flex justify-end mb-6">
                   {/* {categoryProducts} */}

                    {
                        products.length > 0 && (
                    <button
                        type="button"
                        onClick={handleNextClick}
                        className="bg-blue-600 text-white rounded-lg px-8 py-2.5 hover:bg-blue-700 transition-colors font-medium"
                    >
                        Next
                    </button>
                        )
                    }
                </div>

                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : (
                    products.length > 0 ? (
                    <div className="space-y-8">
                        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                            <div key={category}>
                                <h3 className="text-lg font-semibold mb-4 px-2">
                                    {categoryTitles[category as keyof typeof categoryTitles]}
                                </h3>
                                <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                                    {/* Header */}
                                    <div className="grid grid-cols-12 gap-4 bg-muted/50 px-6 py-3 font-semibold text-sm border-b">
                                        <span className="col-span-1 text-center">Product</span>
                                        <span className="col-span-3">Name</span>
                                        <span className="col-span-2 text-center">Brand</span>
                                        <span className="col-span-1 text-center">Minimum Buy</span>
                                        <span className="col-span-2 text-center">Description</span>
                                        <span className="col-span-2 text-center md:text-right">Price</span>
                                        {isAdmin && <span className="col-span-1 text-right">Actions</span>}
                                    </div>
                                    {/* Rows */}
                                    {categoryProducts.map(renderRow)}
                                </div>
                            </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-12 text-muted-foreground">NO Products Found</div>
                    )

                )}

                {/* Auth Modal */}
                {showAuthModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Authentication Required
                            </h2>
                            <p className="mt-3 text-sm text-gray-600">
                                You must be logged in to continue. Do you want to sign in now?
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setShowAuthModal(false)}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => router.push("/signin")}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}