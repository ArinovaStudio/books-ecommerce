export type StationeryItem = {
    id: number
    name: string
    price: number
    qty: number
    minQty: number,
    bundleType: "basic" | "standard" | "advanced"
}

export const StationeryItems: StationeryItem[] = [
    /* ================= BASIC ================= */
    { id: 1, name: "Apsara Pencil", price: 5, qty: 5, minQty: 5, bundleType: "basic" },
    { id: 2, name: "Eraser", price: 3, qty: 2, minQty: 2, bundleType: "basic" },
    { id: 3, name: "Sharpener", price: 5, qty: 1, minQty: 1, bundleType: "basic" },
    { id: 4, name: "Small Notebook", price: 40, qty: 2, minQty: 2, bundleType: "basic" },
    { id: 5, name: "Crayons (12 Shades)", price: 60, qty: 1, minQty: 1, bundleType: "basic" },
    { id: 6, name: "Ruler (15cm)", price: 10, qty: 1, minQty: 1, bundleType: "basic" },

    /* ================= STANDARD ================= */
    { id: 7, name: "Classmate Notebook", price: 90, qty: 4, minQty: 4, bundleType: "standard" },
    { id: 8, name: "Geometry Box", price: 120, qty: 1, minQty: 1, bundleType: "standard" },
    { id: 9, name: "Blue Pen", price: 10, qty: 5, minQty: 5, bundleType: "standard" },
    { id: 10, name: "Black Pen", price: 10, qty: 3, minQty: 3, bundleType: "standard" },
    { id: 11, name: "Pencil Box", price: 80, qty: 1, minQty: 1, bundleType: "standard" },
    { id: 12, name: "Highlighter", price: 25, qty: 2, minQty: 2, bundleType: "standard" },
    { id: 13, name: "Long Notebook", price: 120, qty: 2, minQty: 2, bundleType: "standard" },

    /* ================= Advanced ================= */
    { id: 14, name: "Scientific Calculator", price: 1000, qty: 1, minQty: 1, bundleType: "advanced" },
    { id: 15, name: "World Map", price: 50, qty: 1, minQty: 1, bundleType: "advanced" },
    { id: 16, name: "Reference Books Set", price: 1250, qty: 1, minQty: 1, bundleType: "advanced" },
    { id: 17, name: "Graph Notebook", price: 150, qty: 2, minQty: 2, bundleType: "advanced" },
    { id: 18, name: "Exam Pad", price: 180, qty: 1, minQty: 1, bundleType: "advanced" },
    { id: 19, name: "Desk Organizer", price: 350, qty: 1, minQty: 1, bundleType: "advanced" },
    { id: 20, name: "Drawing Kit (Professional)", price: 450, qty: 1, minQty: 1, bundleType: "advanced" },
]
