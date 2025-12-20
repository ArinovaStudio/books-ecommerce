export type Textbook = {
    id: number
    name: string
    subject: string
    board: "CBSE"
    class: 10
    language: "English" | "Hindi"
    price: number
}

export const Class10Textbooks: Textbook[] = [
    {
        id: 1,
        name: "First Flight",
        subject: "English Literature",
        board: "CBSE",
        class: 10,
        language: "English",
        price: 120,
    },
    {
        id: 2,
        name: "Footprints Without Feet",
        subject: "English Supplementary",
        board: "CBSE",
        class: 10,
        language: "English",
        price: 95,
    },
    {
        id: 3,
        name: "Mathematics – Standard",
        subject: "Mathematics",
        board: "CBSE",
        class: 10,
        language: "English",
        price: 210,
    },
    {
        id: 4,
        name: "Science",
        subject: "Physics, Chemistry & Biology",
        board: "CBSE",
        class: 10,
        language: "English",
        price: 260,
    },
    {
        id: 5,
        name: "India and the Contemporary World – II",
        subject: "History",
        board: "CBSE",
        class: 10,
        language: "English",
        price: 180,
    },
    {
        id: 6,
        name: "Democratic Politics – II",
        subject: "Political Science",
        board: "CBSE",
        class: 10,
        language: "English",
        price: 160,
    },
]
