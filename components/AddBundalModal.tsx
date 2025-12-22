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
import { Plus, Minus, PackagePlus, ShoppingBag, X, Search, ChevronRight, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


type Category = "TEXTBOOK" | "NOTEBOOK" | "STATIONARY" | "OTHER";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    stock: number;
    brand: string | null;
    type: string | null;
    image: string | null;
}

type BundleItem = Product & {
    qty: number;
    minQty: number;
}

type Bundle = {
    id: string;
    title: string;
    offeredPrice: number;
    items: BundleItem[];
    type: string;
}

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    bundle: Bundle
    onSave: (bundle: Bundle) => void
}

export function BundleModal({ open, onOpenChange, bundle, onSave }: Props) {
    const { toast } = useToast();
    const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [bundleName, setBundleName] = useState("")
    const [offeredPrice, setOfferedPrice] = useState(0)

    const [catalog, setCatalog] = useState<Product[]>([]); 
    const [selectedItems, setSelectedItems] = useState<BundleItem[]>([])

    const [notebookBrand, setNotebookBrand] = useState("")
    const [notebookType, setNotebookType] = useState("")
    const [stationeryBrand, setStationeryBrand] = useState("")

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingCatalog(true);
            try {
                const res = await fetch("/api/admin/products");
                const json = await res.json();
                if (json.success) {
                    setCatalog(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast({ title: "Error", description: "Failed to load product catalog", variant: "destructive" });
            } finally {
                setIsLoadingCatalog(false);
            }
        };

        if (open) {
            fetchProducts();
        }
    }, [open]);

    useEffect(() => {
        if (!open || !bundle) return;
        
        setBundleName(bundle.title || "");
        setOfferedPrice(bundle.offeredPrice || 0);

        const mappedItems: BundleItem[] = bundle.items.map(i => ({
            ...i,
            qty: i.qty || 1,
            minQty: 1,
            category: i.category as Category,
            brand: i.brand || null,
            type: i.type || null,
            stock: i.stock || 0,
            image: i.image || null,
            description: i.description || ""
        }));
        
        setSelectedItems(mappedItems);
    }, [open, bundle]);

    const textbooks = catalog.filter(p => p.category === "TEXTBOOK");

    const allNotebooks = catalog.filter(p => p.category === "NOTEBOOK");
    
    const notebookBrandsList = [...new Set(allNotebooks.map(n => n.brand).filter(Boolean))] as string[];
    const notebookTypesList = [...new Set(allNotebooks.map(n => n.type).filter(Boolean))] as string[];

    const filteredNotebooks = allNotebooks.filter(n => {
        const matchBrand = !notebookBrand || n.brand === notebookBrand;
        const matchType = !notebookType || n.type === notebookType;
        return matchBrand && matchType;
    });

    const allStationery = catalog.filter(p => p.category === "STATIONARY" || p.category === "OTHER");
    
    const stationeryBrandsList = [...new Set(allStationery.map(s => s.brand).filter(Boolean))] as string[];

    const filteredStationery = allStationery.filter(s => 
        !stationeryBrand || s.brand === stationeryBrand
    );

    const calculateTotal = (items: BundleItem[]) => {
        return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    };

    const addItem = (product: Product) => {
        let newItems: BundleItem[];
        const existing = selectedItems.find(i => i.id === product.id);

        if (existing) {
            newItems = selectedItems.map(i => 
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i
            );
        } else {
            newItems = [...selectedItems, { ...product, qty: 1, minQty: 1 }];
        }

        setSelectedItems(newItems);
        setOfferedPrice(calculateTotal(newItems));
    };

    const updateQty = (id: string, delta: number) => {
        const newItems = selectedItems.map(i => {
            if (i.id === id) {
                const newQty = Math.max(i.minQty, i.qty + delta);
                return { ...i, qty: newQty };
            }
            return i;
        });

        setSelectedItems(newItems);
        setOfferedPrice(calculateTotal(newItems));
    };

    const removeItem = (id: string) => {
        const newItems = selectedItems.filter(i => i.id !== id);
        
        setSelectedItems(newItems);
        setOfferedPrice(calculateTotal(newItems));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            
            const payload = {
                totalPrice: offeredPrice, 
                items: selectedItems.map(item => ({
                    productId: item.id,
                    quantity: item.qty
                }))
            };

            const res = await fetch(`/api/admin/kits/${bundle.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                toast({ title: "Success", description: "Bundle updated successfully" });
                if (onSave) onSave(); 
                onOpenChange(false);
            } else {
                toast({ title: "Error", description: data.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to save bundle", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
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
                            <Button 
                                className="w-full h-12 mt-4 shrink-0 font-bold" 
                                onClick={handleSave} 
                                disabled={isSaving}
                            >
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSaving ? "Saving..." : "Save Bundle"}
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
                                    {isLoadingCatalog ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : (

                                    <div className="grid grid-cols-3 h-full divide-x divide-border">

                                        {/* TEXTBOOKS COLUMN */}
                                        <div className="flex flex-col h-full min-h-0 p-4">
                                            <div className="shrink-0 mb-4 flex items-center justify-between">
                                                <h5 className="font-bold flex items-center gap-2 text-sm">
                                                    <ChevronRight className="h-4 w-4 text-primary" /> Textbooks
                                                </h5>
                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    {textbooks.length} items
                                                </span>
                                            </div>
                                            <ScrollArea className="flex-1 pr-2">
                                                <div className="space-y-2">
                                                    {textbooks.map(tb => (
                                                        <ProductRow 
                                                            key={tb.id} 
                                                            product={tb} 
                                                            isSelected={selectedItems.some(i => i.id === tb.id)}
                                                            onAdd={addItem}
                                                        />
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
                                                            {notebookBrandsList.map(b => <SelectItem key={b} value={b} className="text-[10px]">{b}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Type Select */}
                                                    <Select value={notebookType || "all"} onValueChange={(val) => setNotebookType(val === "all" ? "" : val)}>
                                                        <SelectTrigger className="h-8 text-[10px] w-1/2 bg-background">
                                                            <SelectValue placeholder="All Types" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all" className="text-[10px]">All Types</SelectItem>
                                                            {notebookTypesList.map(t => <SelectItem key={t} value={t} className="text-[10px]">{t}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <ScrollArea className="flex-1 min-h-0 pr-2">
                                                <div className="space-y-2">
                                                    {filteredNotebooks.map(nb => (
                                                        <ProductRow 
                                                            key={nb.id} 
                                                            product={nb} 
                                                            isSelected={selectedItems.some(i => i.id === nb.id)}
                                                            onAdd={addItem}
                                                            subtext={`${nb.brand || 'Generic'} ${nb.type ? `• ${nb.type}` : ''}`}
                                                        />
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
                                                        <SelectItem value="all" className="text-[10px]">All Brands</SelectItem>
                                                        {stationeryBrandsList.map(b => <SelectItem key={b} value={b} className="text-[10px]">{b}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <ScrollArea className="flex-1 min-h-0 pr-2">
                                                <div className="space-y-2">
                                                    {filteredStationery.map(s => (
                                                        <ProductRow 
                                                            key={s.id} 
                                                            product={s} 
                                                            isSelected={selectedItems.some(i => i.id === s.id)}
                                                            onAdd={addItem}
                                                            subtext={s.brand || 'Generic'}
                                                        />
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                    )}
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
                                                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-background shadow-sm">
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
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r" onClick={() => updateQty(item.id, -1)}>
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-10 text-center text-xs font-bold">{item.qty}</span>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-l" onClick={() => updateQty(item.id, 1)}>
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)} >
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

function ProductRow({ product, isSelected, onAdd, subtext }: { product: Product, isSelected: boolean, onAdd: (p: Product) => void, subtext?: string }) {
    return (
        <Button 
            variant="outline" 
            className={`w-full cursor-pointer justify-between h-auto py-2.5 text-left bg-background hover:border-primary/50 ${isSelected ? "border-primary bg-primary/5" : ""}`} 
            onClick={() => onAdd(product)}
        >
            <div className="truncate pr-2">
                <div className="font-medium text-xs truncate">{product.name}</div>
                <div className="text-[10px] text-muted-foreground">
                    {subtext ? `${subtext} • ` : ""}
                    ₹{product.price}
                </div>
            </div>
            <Plus className="h-3 w-3 shrink-0 text-primary hover:font-primary-foreground" />
            
        </Button>
        
    )
}
