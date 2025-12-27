import { UserProvider } from "@/app/context/userContext"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Profile | Glow Nest",
    description: "Manage your profile and children details",
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <UserProvider>{children}</UserProvider>
}
