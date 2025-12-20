"use client"

import { Button } from "./ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { BundleCard, BundleItem } from "./BundleCard"
import { StationeryItems } from "@/data/demoBundleItems"
import { getItemsByBundleType } from "@/lib/filterBundleItems"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

type Props = {
  onBack: () => void;
  classId: string;
  language: string;
};

type BundleData = {
  id: string;
  title: string;
  offeredPrice: number;
  items: BundleItem[];
  type: string;
  isPopular?: boolean;
};

export function Bundels({ onBack, classId, language }: Props) {
   const { toast } = useToast();
    const [bundles, setBundles] = useState<BundleData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBundles = useCallback(async () => {
        try {
            const res = await fetch(`/api/kits?classId=${classId}&language=${language}`);
            const data = await res.json();

            if (data.success) {
                setBundles(data.kits || []);
            } else {
                toast({ title: "Error", description: data.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch bundles", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [classId, language, toast]);

    useEffect(() => {
        if (classId && language) {
            setLoading(true); 
            fetchBundles();
        }
    }, [fetchBundles, classId, language]);

    return (
        <div>
            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Language
            </Button>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (bundles?.length || 0) === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/20">
                    <p className="text">No bundles found for this class and language.</p>
                    <Button variant="link" className="mt-2">Create a new Bundle</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-3">
                    {bundles.map((bundle) => (
                        <BundleCard key={bundle.id} bundle={bundle} onRefresh={fetchBundles} />
                    ))}
                </div>
            )}
        </div>
    )
}
