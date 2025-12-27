"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useRouter } from "next/navigation";

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
    role: string,
    params: {
        schoolId: string;
        classId: string;
    };
    searchParams: {
        language?: string;
    };
};

const GRID_STYLE =
    "grid grid-cols-1 md:grid-cols-[80px_1fr_120px_100px_100px_100px] gap-3 md:gap-4 items-center"

export default function ProductTable({ role, params, searchParams }: PageProps) {
    const { toast } = useToast()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    const [activeCategory, setActiveCategory] = useState<
        "TEXTBOOK" | "NOTEBOOK" | "STATIONARY"
    >("TEXTBOOK")

    const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [showAuthModal, setShowAuthModal] = useState(false);
    const router = useRouter();

    const handleNextClick = async () => {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (data.authenticated) {
            const query = new URLSearchParams({
                schoolId: params.schoolId,
                classId: params.classId,
            }).toString();
            window.open(`/guardian-form?${query}`, "_blank");
        } else {
            setShowAuthModal(true);
        }
    };


    /** USER cannot edit/delete/add */
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
            });
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
        const filtered = products.filter(
            (p) => p.category.toUpperCase() === activeCategory
        )
        console.log(filtered);
        setCategoryProducts(filtered)

        const total = filtered.reduce(
            (sum, p) => sum + p.price,
            0
        )

        console.log(total);


        setTotalPrice(total)

    }, [activeCategory, products])


    const renderRow = (product: Product) => (
        <div
            key={product.id}
            className={`${GRID_STYLE} px-4 py-4 md:px-6 hover:bg-muted/30 transition border-b last:border-0`}
        >
            {/* Image + Name */}
            <div className="flex items-center gap-4 md:contents">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover border bg-white"
                />
                <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate">{product.name}</span>
                    <div className="md:hidden mt-1 flex gap-2 text-[10px]">
                        <Badge variant="secondary">{product.brand}</Badge>
                        <span className="text-muted-foreground">Stock: {product.stock}</span>
                    </div>
                </div>
            </div>

            {/* Brand */}
            <div className="hidden md:flex justify-center">
                <Badge variant="secondary" className="text-[11px] uppercase">
                    {product.brand}
                </Badge>
            </div>

            {/* Stock */}
            <div className="hidden md:flex justify-center font-bold text-muted-foreground">
                {product.stock}
            </div>

            {/* Price + Actions */}
            <div className="flex items-center justify-between md:contents pt-2 md:pt-0">
                <span className="font-bold text-sm md:text-right">₹{product.price}</span>

                {isAdmin && (
                    <div className="flex items-center justify-end gap-2">
                        {/* Delete */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="ghost">
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
                                    <DialogClose>Cancel</DialogClose>
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
                            trigger={
                                <Button size="icon" variant="ghost">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pb-6 flex flex-row justify-between items-center">
                <CardTitle className="text-xl font-bold">Included Items</CardTitle>
                {isAdmin && <AddEditProductDialog onSuccess={fetchProducts} />}
            </CardHeader>

            <CardContent className="px-0">
                <Tabs value={activeCategory} onValueChange={(val) =>
                    setActiveCategory(val as "TEXTBOOK" | "NOTEBOOK" | "STATIONARY")
                }>
                    <div className="flex justify-between">
                        <div>
                            <TabsList className="mb-6">
                                <TabsTrigger value="TEXTBOOK">Textbooks</TabsTrigger>
                                <TabsTrigger value="NOTEBOOK">Notebooks</TabsTrigger>
                                <TabsTrigger value="STATIONARY">Stationary</TabsTrigger>
                            </TabsList>
                        </div>
                        <button
                            type="button"
                            onClick={handleNextClick}
                            className="bg-blue-600 text-white rounded-lg h-fit px-6 py-2"
                        >
                            Next
                        </button>

                    </div>

                    {showAuthModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Authentication Required
                                </h2>

                                <p className="mt-2 text-sm text-gray-600">
                                    You must be logged in to continue. Do you want to sign in now?
                                </p>

                                <div className="mt-5 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowAuthModal(false)}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        No
                                    </button>

                                    <button
                                        onClick={() => router.push("/signin")}
                                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                    >
                                        Yes, Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {loading ? (
                        <div className="py-20 text-center text-muted-foreground">
                            Loading products...
                        </div>
                    ) : (
                        (["TEXTBOOK", "NOTEBOOK", "STATIONARY"] as const).map((cat) => (
                            // <TabsContent key={cat} value={cat}>
                            //     <div className="border rounded-xl overflow-hidden">
                            //         <div className={`${GRID_STYLE} hidden md:grid bg-muted/50 px-6 py-3`}>
                            //             <span>Preview</span>
                            //             <span>Product</span>
                            //             <span className="text-center">Brand</span>
                            //             <span className="text-center">Qty</span>
                            //             <span className="text-right">Price</span>
                            //             {isAdmin && <span className="text-right">Action</span>}
                            //         </div>

                            //         {products
                            //             .filter(p => p.category.toUpperCase() === cat)
                            //             .map(renderRow)}

                            //         {products.filter(p => p.category.toUpperCase() === cat).length === 0 && (
                            //             <div className="py-12 text-center text-sm text-muted-foreground">
                            //                 No items found.
                            //             </div>
                            //         )}
                            //     </div>
                            // </TabsContent>

                            <TabsContent key={cat} value={cat}>
                                <div className="border rounded-xl overflow-hidden">
                                    <div className={`${GRID_STYLE} hidden md:grid bg-muted/50 px-6 py-3`}>
                                        <span>Preview</span>
                                        <span>Product</span>
                                        <span className="text-center">Brand</span>
                                        <span className="text-center">Qty</span>
                                        <span className="text-right"> ₹ / Piece</span>
                                        {isAdmin && <span className="text-right">Action</span>}
                                    </div>

                                    {(() => {
                                        const filtered = products.filter(
                                            (p) => p.category.toUpperCase() === cat
                                        )

                                        if (filtered.length === 0) {
                                            return (
                                                <div className="py-12 text-center text-sm text-muted-foreground">
                                                    No items found.
                                                </div>
                                            )
                                        }

                                        return filtered.map(renderRow)
                                    })()}
                                </div>
                            </TabsContent>


                        ))
                    )}
                </Tabs>
            </CardContent>
        </Card>
    )
}
