import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

type Props = {
    onSelectingLang: (lang: string) => void
    onBack: () => void
}

export default function LanguageSelector({ onSelectingLang, onBack }: Props) {
    return (
        <div >
            <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to classes
            </Button>
            <div className="flex flex-col md:flex-row min-h-[400px] md:h-56 w-full rounded-xl overflow-hidden border mt-4">
                {/* English */}
                <Button
                    variant='outline'
                    className="flex-1 h-full text-2xl font-semibold cursor-pointer"
                    onClick={() => onSelectingLang("English")}
                >
                    English
                </Button>

                {/* Divider */}
                <div className="w-px bg-border" />

                <div className="h-px bg-border" />

                {/* Hindi */}
                <Button
                    variant='outline'
                    className="flex-1 h-full text-2xl font-semibold cursor-pointer"
                    onClick={() => onSelectingLang("Hindi")}
                >
                    हिंदी
                </Button>
            </div>
        </div>
    )
}