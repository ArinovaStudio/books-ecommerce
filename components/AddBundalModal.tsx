"use client"

import React, { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, PackagePlus, ShoppingBag, X, Search, ChevronRight } from "lucide-react"

import { StationeryItems } from "@/data/demoBundleItems"
import { getItemsByBundleType } from "@/lib/filterBundleItems"
import { Class10Textbooks } from "@/data/demoTextBookData"

/* ================= TYPES ================= */

type BundleItem = {
    id: number
    name: string
    qty: number
    minQty: number
    price: number
    category: "stationery" | "textbook"
}

type Bundle = {
    id?: number
    name: string
    description: string
    offeredPrice: number
    type: "basic" | "standard" | "advanced"
    items: BundleItem[]
}

export type NotebookItem = {
    id: number
    name: string
    brand: string
    type: "Math" | "Ruled" | "Plain"
    price: number
    qty: number
    minQty: number
    bundleType: "basic" | "standard" | "advanced"
}

export const Notebooks: NotebookItem[] = [
    { id: 1, name: "Classmate Notebook - A4", brand: "Classmate", type: "Ruled", price: 50, qty: 3, minQty: 3, bundleType: "basic" },
    { id: 2, name: "Navneet Notebook - A5", brand: "Navneet", type: "Math", price: 60, qty: 3, minQty: 3, bundleType: "basic" },
    { id: 3, name: "Doms Notebook - Single Line", brand: "Doms", type: "Ruled", price: 40, qty: 3, minQty: 3, bundleType: "basic" },
    { id: 4, name: "Classmate Notebook - Plain", brand: "Classmate", type: "Plain", price: 45, qty: 3, minQty: 3, bundleType: "standard" },
    { id: 5, name: "Navneet Notebook - Graph", brand: "Navneet", type: "Math", price: 70, qty: 3, minQty: 3, bundleType: "standard" },
    { id: 6, name: "Doms Notebook - Double Line", brand: "Doms", type: "Ruled", price: 55, qty: 3, minQty: 3, bundleType: "advanced" },
    { id: 7, name: "Classmate Notebook - Advanced Graph", brand: "Classmate", type: "Math", price: 80, qty: 3, minQty: 3, bundleType: "advanced" },
]

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    bundle: Bundle
    onSave: (bundle: Bundle) => void
}

/* ================= COMPONENT ================= */

export function BundleModal({ open, onOpenChange, bundle, onSave }: Props) {
    const [bundleName, setBundleName] = useState("")
    const [description, setDescription] = useState("")
    const [offeredPrice, setOfferedPrice] = useState(0)
    const [selectedItems, setSelectedItems] = useState<BundleItem[]>([])

    // Filters (Logic remains unchanged)
    const [notebookBrand, setNotebookBrand] = useState("")
    const [notebookType, setNotebookType] = useState("")
    const [stationeryBrand, setStationeryBrand] = useState("")

    useEffect(() => {
        if (!open) return
        setBundleName(bundle.name)
        setDescription(bundle.description)
        setOfferedPrice(bundle.offeredPrice)

        const normalized: BundleItem[] = bundle.items.map(i => ({
            ...i,
            minQty: i.minQty ?? 1,
            category: i.category ?? "stationery",
        }))

        const textbooks: BundleItem[] = Class10Textbooks.map(book => ({
            id: book.id,
            name: book.name,
            qty: 1,
            minQty: 1,
            price: book.price,
            category: "textbook",
        }))

        const merged = [...normalized]
        textbooks.forEach(tb => {
            if (!merged.some(i => i.id === tb.id && i.category === "textbook")) {
                merged.push(tb)
            }
        })
        setSelectedItems(merged)
    }, [open, bundle])

    // Logic helpers remain unchanged
    const originalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const stationeryItems = getItemsByBundleType(StationeryItems, bundle.type)
    const filteredNotebooks = Notebooks.filter(n => (!notebookBrand || n.brand === notebookBrand) && (!notebookType || n.type === notebookType))
    const filteredStationery = stationeryItems.filter(s => !stationeryBrand || s.brand === stationeryBrand)

    const addItem = (item: BundleItem) => {
        setSelectedItems(prev => {
            const existing = prev.find(i => i.id === item.id && i.category === item.category);
            if (existing) {
                // Increase quantity by 1
                return prev.map(i =>
                    i.id === item.id && i.category === item.category
                        ? { ...i, qty: i.qty + 1 }
                        : i
                );
            } else {
                return [...prev, { ...item, qty: item.qty || 1, minQty: item.minQty || 1 }];
            }
        });
    };

    const increaseQty = (id: number, category: "stationery" | "textbook") => {
        setSelectedItems(prev =>
            prev.map(i =>
                i.id === id && i.category === category
                    ? { ...i, qty: i.qty + 1 }
                    : i
            )
        );
    };

    const decreaseQty = (id: number, category: "stationery" | "textbook") => {
        setSelectedItems(prev =>
            prev.map(i => {
                if (i.id === id && i.category === category) {
                    // Only decrease if qty is greater than minQty
                    const newQty = Math.max(i.minQty, i.qty - 1);
                    return { ...i, qty: newQty };
                }
                return i;
            })
        );
    };


    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-7xl h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background shadow-2xl flex flex-col overflow-hidden">

                    {/* HEADER: Fixed height, no shrink */}
                    <header className="shrink-0 px-6 py-4 border-b flex items-center justify-between bg-muted/20">
                        <div className="flex items-center gap-3">
                            <PackagePlus className="h-5 w-5 text-primary" />
                            <Dialog.Title className="text-xl font-bold">Configure Bundle</Dialog.Title>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </header>

                    {/* MAIN WRAPPER: Must have h-full and min-h-0 */}
                    <div className="flex-1 flex overflow-hidden h-full min-h-0">

                        {/* LEFT SIDEBAR: Fixed width, handles its own layout */}
                        <aside className="w-80 border-r bg-muted/5 p-6 flex flex-col shrink-0">
                            <div className="flex-1 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase">Bundle Name</Label>
                                        <Input value={bundleName} onChange={e => setBundleName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase">Offered Price (₹)</Label>
                                        <Input type="number" value={offeredPrice} onChange={e => setOfferedPrice(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full h-12 mt-4 shrink-0 font-bold">
                                Save Bundle
                            </Button>
                        </aside>

                        {/* RIGHT CONTENT: Tabs must take remaining height */}
                        <main className="flex-1 flex flex-col h-full min-h-0 min-w-0">
                            <Tabs defaultValue="catalog" className="flex-1 flex flex-col min-h-0">
                                <TabsList className="shrink-0 px-6 border-b h-14 bg-background rounded-none justify-start gap-8">
                                    <TabsTrigger value="catalog" className="h-full px-2  data-[state=active]:bg-primary/10 rounded-none bg-transparent shadow-none font-semibold">
                                        Item Catalog
                                    </TabsTrigger>
                                    <TabsTrigger value="selected" className="h-full px-2  data-[state=active]:bg-primary/10 rounded-none bg-transparent shadow-none font-semibold">
                                        Selected Items ({selectedItems.length})
                                    </TabsTrigger>
                                </TabsList>

                                {/* CATALOG TAB: Column Layout */}
                                <TabsContent value="catalog" className="flex-1 m-0 h-full min-h-0 overflow-hidden bg-muted/5">
                                    <div className="grid grid-cols-3 h-full divide-x divide-border">

                                        {/* TEXTBOOKS COLUMN */}
                                        <div className="flex flex-col h-full min-h-0 p-4">
                                            <div className="shrink-0 mb-4 flex items-center justify-between">
                                                <h5 className="font-bold flex items-center gap-2 text-sm">
                                                    <ChevronRight className="h-4 w-4 text-primary" /> Textbooks
                                                </h5>
                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    {Class10Textbooks.length} items
                                                </span>
                                            </div>
                                            <ScrollArea className="flex-1 pr-2">
                                                <div className="space-y-2">
                                                    {Class10Textbooks.map(tb => (
                                                        <Button key={tb.id} variant="outline" className="w-full justify-between h-auto py-2.5 text-left bg-background hover:border-primary/50" disabled={selectedItems.some(i => i.id === tb.id && i.category === "textbook")} onClick={() => addItem({ ...tb, category: "textbook" })}>
                                                            <div className="truncate pr-2">
                                                                <div className="font-medium text-xs truncate">{tb.name}</div>
                                                                <div className="text-[10px] text-muted-foreground">₹{tb.price}</div>
                                                            </div>
                                                            <Plus className="h-3 w-3 shrink-0 text-primary" />
                                                        </Button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        {/* NOTEBOOKS COLUMN with restored Filters */}
                                        <div className="flex flex-col h-full min-h-0 p-4">
                                            <div className="shrink-0 mb-4 space-y-3">
                                                <h5 className="font-bold text-sm flex items-center gap-2">
                                                    <ChevronRight className="h-4 w-4 text-primary" /> Notebooks
                                                </h5>
                                                <div className="flex gap-2">
                                                    <Select value={notebookBrand || "all"} onValueChange={(val) => setNotebookBrand(val === "all" ? "" : val)}>
                                                        <SelectTrigger className="h-8 text-[10px] w-1/2 bg-background">
                                                            <SelectValue placeholder="All Brands" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all" className="text-[10px]">All Brands</SelectItem>
                                                            {[...new Set(Notebooks.map((n) => n.brand))].map((b) => (
                                                                <SelectItem key={b} value={b} className="text-[10px]">
                                                                    {b}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Type Select */}
                                                    <Select value={notebookType || "all"} onValueChange={(val) => setNotebookType(val === "all" ? "" : val)}>
                                                        <SelectTrigger className="h-8 text-[10px] w-1/2 bg-background">
                                                            <SelectValue placeholder="All Types" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all" className="text-[10px]">All Types</SelectItem>
                                                            {[...new Set(Notebooks.map((n) => n.type))].map((t) => (
                                                                <SelectItem key={t} value={t} className="text-[10px]">
                                                                    {t}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <ScrollArea className="flex-1 min-h-0 pr-2">
                                                <div className="space-y-2">
                                                    {filteredNotebooks.map(nb => (
                                                        <Button key={nb.id} variant="outline" className="w-full cursor-pointer justify-between h-auto py-2.5 text-left bg-background hover:border-primary/50" onClick={() => addItem({ ...nb, category: "notebook" })}>
                                                            <div className="truncate pr-2">
                                                                <div className="font-medium text-xs truncate">{nb.name}</div>
                                                                <div className="text-[10px] text-muted-foreground">{nb.brand} • ₹{nb.price}</div>
                                                            </div>
                                                            <Plus className="h-3 w-3 shrink-0 text-primary hover:font-primary-foreground" />
                                                        </Button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        {/* STATIONERY COLUMN with restored Filter */}
                                        <div className="flex flex-col h-full min-h-0 p-4">
                                            <div className="shrink-0 mb-4 space-y-3">
                                                <h5 className="font-bold text-sm flex items-center gap-2">
                                                    <ChevronRight className="h-4 w-4 text-primary" /> Stationery
                                                </h5>
                                                <Select value={stationeryBrand || "all"} onValueChange={(val) => setStationeryBrand(val === "all" ? "" : val)}>
                                                    <SelectTrigger className="h-8 text-[10px] w-full bg-background">
                                                        <SelectValue placeholder="All Stationery Brands" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all" className="text-[10px]">All Stationery Brands</SelectItem>
                                                        {[...new Set(stationeryItems.map((s) => s.brand))].map((b) => (
                                                            <SelectItem key={b} value={b} className="text-[10px]">
                                                                {b}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <ScrollArea className="flex-1 min-h-0 pr-2">
                                                <div className="space-y-2">
                                                    {filteredStationery.map(s => (
                                                        <Button key={s.id} variant="outline" className="w-full cursor-pointer justify-between h-auto py-2.5  text-left bg-background hover:border-primary/50" onClick={() => addItem({ ...s, category: "stationery" })}>
                                                            <div className="truncate pr-2">
                                                                <div className="font-medium text-xs truncate">{s.name}</div>
                                                                <div className="text-[10px] text-muted-foreground">₹{s.price}</div>
                                                            </div>
                                                            <Plus className="h-3 w-3 shrink-0 text-primary hover:text-primary-foreground" />
                                                        </Button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* SELECTED TAB: List Layout */}
                                <TabsContent value="selected" className="flex-1 m-0 min-h-0 p-6 overflow-hidden">
                                    <ScrollArea className="h-full">
                                        {selectedItems.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                                                <ShoppingBag className="h-10 w-10 mb-2 opacity-20" />
                                                <p className="text-sm">No items selected yet</p>
                                            </div>
                                        ) : (
                                            <div className="max-w-2xl mx-auto space-y-3 pr-4">
                                                {selectedItems.map(item => (
                                                    <div key={`${item.category}-${item.id}`} className="flex items-center justify-between p-3 border rounded-lg bg-background shadow-sm">
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-[10px] uppercase font-bold text-primary/70">{item.category}</span>
                                                            <span className="text-sm font-semibold truncate">{item.name}</span>
                                                            <span className="text-[10px] text-muted-foreground">₹{item.price} per unit</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 shrink-0">
                                                            <div className="text-right mr-2">
                                                                <div className="text-sm font-bold">₹{item.price * item.qty}</div>
                                                            </div>
                                                            <div className="flex items-center border rounded-md bg-muted/30">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r" onClick={() => decreaseQty(item.id, item.category)}>
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-10 text-center text-xs font-bold">{item.qty}</span>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-l" onClick={() => increaseQty(item.id, item.category)}>
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setSelectedItems(prev => prev.filter(i => !(i.id === item.id && i.category === item.category)))}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </main>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
