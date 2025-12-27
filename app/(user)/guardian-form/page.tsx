import { Suspense } from "react";
import { GuardianForm } from "@/components/guardian-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuardianForm />
    </Suspense>
  );
}
