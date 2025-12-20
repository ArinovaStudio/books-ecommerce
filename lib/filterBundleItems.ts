import { StationeryItem } from "@/data/demoBundleItems"

export function getItemsByBundleType(
    items: StationeryItem[],
    bundleType: "basic" | "standard" | "advanced"
): StationeryItem[] {
    return items.filter(item => item.bundleType === bundleType)
}
