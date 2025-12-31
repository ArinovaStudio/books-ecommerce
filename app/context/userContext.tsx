"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"

/* ================= TYPES ================= */

type Role = "USER"

export type User = {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
    role: Role
}

export type Student = {
    id: string
    name: string
    rollNo: string
    section: string
    school: string
    dob: string | null
    bloodGroup: string | null
    gender: string | null
    class: {
        name: string
    }
}

export type UserProfile = {
    name: string
    email: string
    phone: string | null
    address: string | null
    role: "USER" | "ADMIN" | "SUB_ADMIN"
    status: "ACTIVE" | "INACTIVE"
    children: Student[]
}

/* ================= CONTEXT ================= */

interface UserContextType {
    user: User | null
    loading: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

/* ================= PROVIDER ================= */

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
            })

            if (!res.ok) {
                setUser(null)
                router.push("/signin")
                return
            }

            const data = await res.json()

            // if (data.user.role !== "USER") {
            //     throw new Error("Unauthorized")
            // }

            setUser(data.user)
        } catch (error) {
            console.error("User auth failed:", error)
            setUser(null)
            router.push("/signin")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2Icon className="animate-spin w-8 h-8" />
            </div>
        )
    }

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                refreshUser: fetchUser,
                logout: async () => {
                    await fetch("/api/auth/logout", { method: "POST" })
                    router.push("/signin")
                },
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

/* ================= HOOK ================= */

export function useUser() {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error("useUser must be used inside UserProvider")
    }

    return context
}