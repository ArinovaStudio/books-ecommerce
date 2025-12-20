"use client";
import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
    CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Standard shadcn helper
import { BundleModal } from "./AddBundalModal";

export type BundleItem = {
    id: number;
    name: string;
    qty: number;
    price: number;
};

type Bundle = {
    title: string;
    offeredPrice: number;
    items: BundleItem[];
    type: string;
    isPopular?: boolean;
};

export function BundleCard({ bundle }: { bundle: Bundle }) {
    const { title, offeredPrice, items, type, isPopular } = bundle;

    const [isEdit, setIsEdit] = useState(false);

    const originalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalDiscount = originalPrice - offeredPrice;
    const discountPercent = originalPrice > 0 ? Math.round((totalDiscount / originalPrice) * 100) : 0;

    return (
        <Card className={cn(
            "relative flex flex-col h-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl",
            "bg-background border-border hover:border-orange-500/50"
        )}>
            {isPopular && (
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full z-10">
                    Popular
                </div>
            )}

            <CardHeader className="px-8">
                <CardTitle className="text-2xl font-bold text-foreground">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow space-y-4 px-8">
                {/* Price Section */}
                <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold tracking-tight text-foreground">
                            ₹{offeredPrice.toLocaleString()}
                        </span>
                    </div>

                    {discountPercent > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground line-through">
                                ₹{originalPrice.toLocaleString()}
                            </span>
                            <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-bold">
                                {discountPercent}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Features Divider - Lines adapt to theme via border-border */}
                <div className="relative flex items-center justify-center py-2">
                    <div className="w-full border-t border-border"></div>
                    <span className="absolute bg-background px-4 text-[11px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
                        Included Items
                    </span>
                    {/* Accent Dots */}
                    <div className="absolute left-0 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <div className="absolute right-0 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                </div>

                {/* Items List */}
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-start gap-4 group">
                            <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                            <div className="flex justify-between w-full text-sm">
                                <span className="text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                                    {item.name}
                                </span>
                                <span className="text-muted-foreground font-mono bg-muted px-1.5 rounded">
                                    x{item.qty}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="flex w-full gap-2">
                <Button
                    variant="outline"
                    className="w-1/2 rounded-xl h-12 cursor-pointer hover:text-background border-input transition-all"
                >
                    View Full Details
                </Button>
                <Button
                    onClick={() => setIsEdit(true)}
                    variant="default"
                    className="w-1/2 rounded-2xl h-12 cursor-pointer border-input transition-all"
                >
                    Edit Bundle
                </Button>
            </CardFooter>

            <BundleModal
                open={isEdit}
                onOpenChange={setIsEdit}
                bundle={bundle}
                type={type}
                updateBundle={(bundle: Bundle) => console.log("Update", bundle)}
            />

        </Card>
    );
}