import { ClassItem } from "@/types/classTypes";
import Link from "next/link";


interface ClassCardProps {
    data: ClassItem;
    schoolId: string;
}

export default function ClassCard({ data, schoolId }: ClassCardProps) {
    return (
        <Link
            href={`/schools/${schoolId}/class/${data.id}`}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
        >
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <p className="text-gray-500 text-sm mt-1">
                Sections: {data.sections.join(", ")}
            </p>
        </Link>
    );
}
