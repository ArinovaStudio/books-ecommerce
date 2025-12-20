import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle } from "./ui/card"

type Props = {
    onSelectingLang?: (lang: string) => void
    onBack: () => void
}

const Language = [
    "English",
    "हिंदी"
]

export default function LanguageSelector({ onSelectingLang, onBack }: Props) {
    return (
        <div >
            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to classes
            </Button>
            <div className="grid mt-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Language.map((lng) => (
                    <Card
                        key={lng}
                        onClick={onSelectingLang ? () => onSelectingLang(lng) : undefined}
                        className={`transition ${onSelectingLang
                            ? "cursor-pointer hover:shadow-md"
                            : "cursor-default"
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="text-center text-base">
                                {lng}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}