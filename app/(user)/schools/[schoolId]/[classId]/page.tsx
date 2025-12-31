"use client"
import ProductTables from "@/components/product-tables"
import { useParams, useSearchParams } from "next/navigation";

export default function PricingCards() {
  const params = useParams();
  const searchParams = useSearchParams();

  const schoolId = params.schoolId;
  const classId = params.classId;
  const language = searchParams.get("language");

  return (
    <div className="min-h-screen p-8">
      <ProductTables role="USER" params={{ schoolId: schoolId as string, classId: classId as string }} searchParams={{ language: language as string }} />
    </div>
  )
}
