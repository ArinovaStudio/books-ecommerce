import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"

const classes = [
    "Nursery",
    "LKG",
    "UKG",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
]

type Props = {
    school?: {
        id: number
        name: string
    }
    onBack?: () => void
    onSelectClass?: (className: string) => void
}

export function SchoolClasses({
    school,
    onBack,
    onSelectClass,
}: Props) {
    return (
        <div className="space-y-4">
            {onBack && (
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            )}

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {classes.map((cls) => (
                    <Card
                        key={cls}
                        onClick={onSelectClass ? () => onSelectClass(cls) : undefined}
                        className={`transition ${onSelectClass
                            ? "cursor-pointer hover:shadow-md"
                            : "cursor-default"
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="text-center text-base">
                                {cls}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}
