import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
type Props = {
    onBack: () => void
}

export function Bundels({ onBack }: Props) {
    return (
        <div>
            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Language
            </Button>
            <div>

            </div>
        </div>
    )
}