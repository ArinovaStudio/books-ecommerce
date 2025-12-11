import Header from "@/components/header";
import ClassCard from "@/components/classcard";
import { ClassItem } from "@/types/classTypes";

interface SchoolClassesPageProps {
    params: {
        schoolId: string;
    };
}

export default async function SchoolClassesPage({ params }: SchoolClassesPageProps) {
    const { schoolId } = await params;

    const classes: ClassItem[] = [
        { id: 1, name: "Class 1", sections: ["A", "B", "C"] },
        { id: 2, name: "Class 2", sections: ["A", "B", "C"] },
        { id: 3, name: "Class 3", sections: ["A", "B"] },
        { id: 4, name: "Class 4", sections: ["A", "B"] },
        { id: 5, name: "Class 5", sections: ["A", "B", "C"] },
        { id: 6, name: "Class 6", sections: ["A", "B", "C", "D"] },
        { id: 7, name: "Class 7", sections: ["A", "B", "C", "D"] },
        { id: 8, name: "Class 8", sections: ["A", "B", "C"] },
        { id: 9, name: "Class 9", sections: ["A", "B"] },
        { id: 10, name: "Class 10", sections: ["A", "B"] },
        { id: 11, name: "Class 11", sections: ["Science", "Commerce", "Arts"] },
        { id: 12, name: "Class 12", sections: ["Science", "Commerce", "Arts"] },
    ];


    return (
        <section className="bg-gray-50  min-h-screen">
            {/* Header */}
            <Header classname="pt-7 pb-3 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]" />
            <div className="">
                <div className=" px-4 sm:px-6 lg:px-0 py-8 max-w-7xl mx-auto">

                    {/* Page Title */}
                    <h1 className="text-3xl font-semibold text-blue-950 capitalize">
                        {schoolId.replace(/-/g, " ")} – Classes
                    </h1>

                    {/* Search Input (Optional if you want Header search only) */}
                    {/* <div className="mt-6">
          <input
            type="text"
            placeholder="Search class..."
            className="w-full px-4 py-3 border rounded-xl focus:ring-primary focus:border-primary"
          />
        </div> */}

                    {/* Classes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                        {classes.map((cls) => (
                            <ClassCard key={cls.id} data={cls} schoolId={schoolId} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
