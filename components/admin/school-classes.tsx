import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Share, Share2 } from "lucide-react"
import { useToast } from "../ui/use-toast"
const hostName = process.env.NEXT_PUBLIC_DOMAIN;

type ClassItem = { name: string }

const CLASS_ORDER = [
  "Nursery", "PP I", "PP II",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12"
]

const normalize = (name: string) =>
  name
    .replace(/\s+/g, " ")
    .trim()

const sortClasses = (a: ClassItem, b: ClassItem): number => {
  const indexA = CLASS_ORDER.indexOf(normalize(a.name))
  const indexB = CLASS_ORDER.indexOf(normalize(b.name))

  return (indexA === -1 ? Infinity : indexA) -
         (indexB === -1 ? Infinity : indexB)
}


type ClassType = {
    id: string
    name: string
}

type SelectableItem = {
    id: string
    name: string
}

type Props = {
    schoolId: string
    onBack?: () => void
    onSelectClass?: (school: SelectableItem) => void
}

export function SchoolClasses({
    schoolId,
    onBack,
    onSelectClass,
}: Props) {
    const [classes, setClasses] = useState<ClassType[]>([])
    const [loading, setLoading] = useState(false)
    const {toast} = useToast();
    useEffect(() => {
        if (!schoolId) {
            setClasses([])
            setLoading(false)
            return
        }

        const fetchClasses = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/admin/schools/${schoolId}/classes`)
                const data = await res.json()
                if (data.success) {
                    setClasses(data.classes.sort(sortClasses))
                } else {
                    setClasses([])
                }
            } catch (error) {
                console.error("Failed to fetch classes", error)
                setClasses([])
            } finally {
                setLoading(false)
            }
        }

        fetchClasses()
    }, [schoolId])

    return (
        <div className="space-y-4">
            {onBack && (
                <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Schools
                </Button>
                <Button type="button" onClick={()=>{
                    navigator.clipboard.writeText(`${hostName}/signup?id=${schoolId}`)
                    toast({
                        title: "Success",
                        description: "Link Copied Successfully!"
                    })
                    }}>
                    <Share2 size={30}/>
                    Share Invite Link
                </Button>
                </div>
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
                    {classes.map((cls, index) => (
                        <Card
                            key={index}
                            onClick={() => onSelectClass ? onSelectClass(cls) : undefined}
                            className={`transition cursor-pointer hover:shadow-md hover:text-white hover:bg-[var(--primary)]`}
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
