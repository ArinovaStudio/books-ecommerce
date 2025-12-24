"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type User = {
    id: string
    name: string
    email: string
    role: string
}

export function PromoteUserDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [suggestions, setSuggestions] = useState<User[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    /* 🔁 Debounced email search */
    useEffect(() => {
        if (email.length < 2) {
            setSuggestions([])
            return
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/user?q=${email}`)
                if (!res.ok) {
                    console.error(await res.text())
                    return
                }
                const data: User[] = await res.json()
                setSuggestions(data)
            } catch (err) {
                console.error(err)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [email])

    const promoteUser = async () => {
        if (!user) return

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message ?? "Something went wrong")
                return
            }

            toast({
                title: "User Promoted",
                description: "User has been promoted to ADMIN",
                variant: "default",
            })

            setUser(null)
            setEmail("")
            setSuggestions([])
            setOpen(false)
        } catch (err) {
            toast({
                title: "Error Promoting User",
                description: `${err}`,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Promote User</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Promote User to Admin</DialogTitle>
                </DialogHeader>

                <div className="relative space-y-2">
                    <Input
                        placeholder="Search by email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setUser(null)
                            setError("")
                        }}
                        onBlur={() => {
                            setTimeout(() => {
                                if (!user) setEmail("")
                                setSuggestions([])
                            }, 150)
                        }}
                        onFocus={() => {
                            if (email.length >= 2) setSuggestions(suggestions)
                        }}
                    />

                    {suggestions.length > 0 && !user && (
                        <div className="absolute z-10 w-full rounded-md border bg-background shadow">
                            {suggestions.map((u) => (
                                <button
                                    key={u.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        setUser(u)
                                        setEmail(u.email)
                                        setSuggestions([])
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 hover:bg-muted"
                                    )}
                                >
                                    <p className="text-sm font-medium">{u.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {u.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {user && (
                        <div className="mt-4 rounded-md border p-3 space-y-2">
                            <p><b>Name:</b> {user.name}</p>
                            <p><b>Email:</b> {user.email}</p>
                            <p><b>Role:</b> {user.role}</p>

                            {user.role !== "ADMIN" && (
                                <Button
                                    onClick={promoteUser}
                                    disabled={loading}
                                >
                                    {loading ? "Promoting..." : "Promote to ADMIN"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
