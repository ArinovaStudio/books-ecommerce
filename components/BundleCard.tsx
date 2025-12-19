import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"



export function BundleCard({ title, price }: { title: string, price: number }) {

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle className="text-4xl font-bold text-center">{title}</CardTitle>
            </CardHeader>

            <CardDescription className="text-center">
                <p className="text-3xl font-bold font-sans">Rs. {price}</p>
            </CardDescription>

            <CardFooter>
                <Button variant="outline" className="w-full cursor-pointer">
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}