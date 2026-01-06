"use client"

import { useEffect, useState } from "react"
import { Plus, UploadCloud, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

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

type Props = {
    setProducts?: any
    selectedSchool?: any
    selectedClass?: any
    product?: Product          // 👈 optional
    onSuccess: () => void
    trigger?: React.ReactNode  // 👈 custom trigger (Edit button)
}


export default function AddEditProductDialog({
    selectedSchool,
    selectedClass,
    product,
    onSuccess,
    trigger,
    setProducts
}: Props) {
    const { toast } = useToast()
    const isEdit = !!product

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [category, setCategory] = useState("")
    const [productClass, setProductClass] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    /* ✅ Prefill for edit */
    useEffect(() => {
        if (product) {
            setCategory(product.category)
            setProductClass(product.class || "")
            setImagePreview(product.image)
        }
    }, [product,selectedClass,selectedSchool])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!category) throw new Error("Please select category")
            const form = e.target as HTMLFormElement
            const formData = new FormData(form)
            formData.append("category", category)
            formData.append("classId",selectedClass);
            formData.append("schoolId",selectedSchool);
            if (image) formData.append("image", image)

            const res = await fetch(
                isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
                {
                    method: isEdit ? "PUT" : "POST",
                    body: formData,
                }
            )

            if (!res.ok) throw new Error("Failed to save product")

            toast({
                title: "Success",
                description: isEdit ? "Product updated" : "Product added",
            })

            onSuccess()
            setOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const sanitizePositiveNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value

  if (value === "") return

  const num = Number(value)

  if (isNaN(num) || num < 1) {
    e.target.value = "1"
  }
}

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                {trigger || (
                    <Button>
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Product Name</Label>
                        <Input name="name" defaultValue={product?.name} required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Input
                            name="description"
                            defaultValue={product?.description}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TEXTBOOK">Textbook</SelectItem>
                                    <SelectItem value="NOTEBOOK">Notebook</SelectItem>
                                    <SelectItem value="STATIONARY">Stationary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Minimum Quantity</Label>
                            <Input
                                name="stock"
                                type="number"
                                min={1}
                                onChange={sanitizePositiveNumber}
                                defaultValue={product?.stock}
                                required
                            />
                        </div>

                        {/* {category === "TEXTBOOK" && (
                            <div className="grid gap-2">
                                <Label>Class</Label>
                                <Select value={productClass} onValueChange={setProductClass}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <SelectItem key={i} value={`class-${i + 1}`}>
                                                Class {i + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )} */}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Brand</Label>
                            <Input name="brand" defaultValue={product?.brand} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Price (₹)</Label>
                            <Input
                                name="price"
                                type="number"
                                min={0}
                                onChange={sanitizePositiveNumber}
                                defaultValue={product?.price}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Product Image</Label>

                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setImage(file)
                                setImagePreview(URL.createObjectURL(file))
                            }}
                        />

                        <Label
                            htmlFor="image"
                            className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer"
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            ) : (
                                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                            )}
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => {setOpen(false), setProducts && setProducts([]), setImagePreview(null)}}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Update" : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
