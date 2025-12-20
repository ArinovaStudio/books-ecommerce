"use client"

import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { BundleCard } from "./BundleCard"
import { StationeryItems } from "@/data/demoBundleItems"
import { getItemsByBundleType } from "@/lib/filterBundleItems"

type Props = {
    onBack: () => void
}

export function Bundels({ onBack }: Props) {
    const basicItems = getItemsByBundleType(StationeryItems, "basic")
    const standardItems = getItemsByBundleType(StationeryItems, "standard")
    const advancedItems = getItemsByBundleType(StationeryItems, "advanced")

    return (
        <div>
            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Language
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-3">
                <BundleCard
                    bundle={{
                        title: "Basic",
                        offeredPrice: 999,
                        items: basicItems,
                        type: "basic",
                        isPopular: false,
                    }}
                />

                <BundleCard
                    bundle={{
                        title: "Standard",
                        offeredPrice: 1999,
                        items: standardItems,
                        type: "standard",
                        isPopular: true,
                    }}
                />

                <BundleCard
                    bundle={{
                        title: "Premium",
                        offeredPrice: 2999,
                        items: advancedItems,
                        type: "advanced",
                        isPopular: false,
                    }}
                />
            </div>
        </div>
    )
}
