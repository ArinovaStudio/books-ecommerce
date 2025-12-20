import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

const sortClasses = (a: { name: string }, b: { name: string }) => {
    const order = [
        "Nursery", "LKG", "UKG", 
        "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
        "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", 
        "Class 11", "Class 12"
    ];
    return order.indexOf(a.name) - order.indexOf(b.name);
}

type ClassType = {
    id: string
    name: string
}

type Props = {
    school?: {
        id: string 
        name: string
    } | null 
    onBack?: () => void
    onSelectClass?: (className: { id: string; name: string }) => void
}

export function SchoolClasses({
    school,
    onBack,
    onSelectClass,
}: Props) {

    const [classes, setClasses] = useState<ClassType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!school?.id) return;

        const fetchClasses = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/admin/schools/${school.id}/classes`)
                const data = await res.json()

                if (data.success) {
                    const sorted = data.classes.sort(sortClasses)
                    setClasses(sorted)
                } else {
                    setClasses([])
                }
            } catch (error) {
                console.error("Failed to fetch classes", error)
            } finally {
                setLoading(false)
            }
        }

        fetchClasses()
    }, [school?.id])

    return (
        <div className="space-y-4">
            {onBack && (
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-xl">
                    No classes found for this school.
                </div>
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {classes.map((cls,index) => (
                    <Card
                        key={index}
                        onClick={onSelectClass ? () => onSelectClass({ id: cls.id, name: cls.name }) : undefined}
                        className={`transition ${onSelectClass
                            ? "cursor-pointer hover:shadow-md"
                            : "cursor-default"
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="text-center text-base">
                                {cls.name}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            )}
        </div>
    )
}
