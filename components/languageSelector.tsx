import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "./ui/dialog"
import { usePathname } from "next/navigation"

type Props = {
    schoolId: string;
    classId: string;
    onSelectingLang?: (lang: string) => void
    onBack: () => void
}

export default function LanguageSelector({ schoolId, classId, onSelectingLang, onBack }: Props) {

    const [languages, setLanguages] = useState<string[]>([])
    const [newLang, setNewLang] = useState("")
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [subAdmin, setSubAdmin] = useState(false);

    // for getting the admin or subadmin
    const pathname = usePathname()
    const segment = pathname.split("/")[1]

    useEffect(() => {
        if (segment === "subadmin") {
            setSubAdmin(true)
        }
    }, [segment])

    const fetchLanguage = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/schools/${schoolId}/languages`)
            const data = await res.json();

            if (data.success) {
                // console.log(data);
                setLanguages(data.languages);
            }
        } catch (error) {
            alert("Failed to fetch languages");
            // console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const handleAddLanguage = () => {
        const lang = newLang.trim();
        if (!lang) return;

        const exist = languages.includes(lang)
        if (exist) {
            setNewLang("")
            setIsDialogOpen(false)
            alert("Language already exists");
            return
        }
        if (newLang.trim() && !languages.includes(newLang)) {
            setLanguages([...languages, newLang.trim()])
            setNewLang("")
            setIsDialogOpen(false)
        }
    }

    const deleteLanguage = (e: React.MouseEvent, langToDelete: string) => {
        e.stopPropagation()
        setLanguages(languages.filter((lang) => lang !== langToDelete))
    }

    useEffect(() => {
        fetchLanguage()
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <Button variant="ghost" onClick={onBack} className="gap-2 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    Back to classes
                </Button>

                {subAdmin && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" className="gap-2 cursor-pointer">
                                <Plus className="h-4 w-4" />
                                Add Language
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Language</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    placeholder="e.g. Spanish, French..."
                                    value={newLang}
                                    onChange={(e) => setNewLang(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddLanguage}>Add Language</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid mt-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {languages.map((lng) => (
                        <Card
                            key={lng}
                            onClick={onSelectingLang ? () => onSelectingLang(lng) : undefined}
                            className={`group relative transition ${onSelectingLang
                                ? "cursor-pointer hover:shadow-md"
                                : "cursor-default"
                                }`}
                        >
                            <button
                                onClick={(e) => deleteLanguage(e, lng)}
                                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            <CardHeader>
                                <CardTitle className="text-center text-base">{lng}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )
            }
        </div>
    )
}