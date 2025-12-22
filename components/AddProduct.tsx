"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
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

type Props = {
    onAdd: (product: any) => void
}

export default function AddProductDialog({ onAdd }: Props) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        productName: "",
        brandName: "",
        type: "textbook",
        planType: "basic",
        classes: "",
        price: "",
        image: null
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const resetForm = () => {
        setFormData({
            productName: "",
            brandName: "",
            type: "textbook",
            planType: "basic",
            classes: "",
            price: "",
            image: null,
        })
        setImagePreview(null)
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newProduct = {
            id: `${formData.type}-${Date.now()}`,
            ...formData,
            price: Number(formData.price),
        }

        onAdd(newProduct)
        setOpen(false)
        resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                resetForm()
            }
            setOpen(isOpen);
        }}>
            <DialogTrigger asChild>
                <Button className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Product Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Mathematics Grade 10"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v) => setFormData({ ...formData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="textbook">Textbook</SelectItem>
                                    <SelectItem value="notebook">Notebook</SelectItem>
                                    <SelectItem value="stationary">Stationary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Plan */}
                        <div className="grid gap-2">
                            <Label>Plan Type</Label>
                            <Select
                                value={formData.planType}
                                onValueChange={(v) => setFormData({ ...formData, planType: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Class */}
                    {formData.type === "textbook" && (
                        <div className="w-full">
                            <Label>Class</Label>
                            <Select
                                value={formData.classes}
                                onValueChange={(v) => setFormData({ ...formData, classes: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem defaultValue="class-1" value="class-1">Class 1</SelectItem>
                                    <SelectItem value="class-2">Class 2</SelectItem>
                                    <SelectItem value="class-3">Class 3</SelectItem>
                                    <SelectItem value="class-4">Class 4</SelectItem>
                                    <SelectItem value="class-5">Class 5</SelectItem>
                                    <SelectItem value="class-6">Class 6</SelectItem>
                                    <SelectItem value="class-7">Class 7</SelectItem>
                                    <SelectItem value="class-8">Class 8</SelectItem>
                                    <SelectItem value="class-9">Class 9</SelectItem>
                                    <SelectItem value="class-10">Class 10</SelectItem>
                                    <SelectItem value="class-11">Class 11</SelectItem>
                                    <SelectItem value="class-12">Class 12</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Brand */}
                        <div className="grid gap-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                placeholder="NCERT"
                                value={formData.brandName}
                                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                required
                            />
                        </div>
                        {/* Price */}
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="grid gap-2">
                        <Label htmlFor="image">Product Image</Label>

                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return

                                setFormData({ ...formData, image: file })

                                const url = URL.createObjectURL(file)
                                setImagePreview(url)
                            }}
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 h-32 w-32 rounded-md object-cover border"
                            />
                        )}
                    </div>


                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Product</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}