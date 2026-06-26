import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type ReceiptProps = {
  order?: any;
};

const COMPANY = "Glow Nest";
const NOT_AVAILABLE = "Not Provided";

export default function Printable({ order }: ReceiptProps) {
  const parent = order?.students?.[0]?.student?.parent;
  const students = Object.values(order?.students ?? {}) ?? [];

  return (
    <Card
      id="printReceipt"
      className="absolute -left-[9999px] w-full max-w-sm mx-auto rounded-xl shadow-sm"
    >
      <CardContent className="p-6 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              className="rounded-full"
              alt={COMPANY}
              width={40}
              height={40}
            />
            <div>
              <p className="font-semibold text-sm">{COMPANY}</p>
              <p className="text-xs text-muted-foreground">contact@glow-nest.in</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold">#{order?.id ?? NOT_AVAILABLE}</p>
            <p className="text-xs text-muted-foreground">
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : NOT_AVAILABLE}
            </p>
          </div>
        </div>

        <Separator />

        {/* Ship To */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ship To</p>
          <p className="text-base font-bold">{parent?.name ?? NOT_AVAILABLE}</p>
          <p className="text-sm text-muted-foreground">{order?.landmark ?? NOT_AVAILABLE}</p>
          <p className="text-sm text-muted-foreground">Pincode: {order?.pincode ?? NOT_AVAILABLE}</p>
          <p className="text-sm text-muted-foreground">Phone: {order?.phone ?? NOT_AVAILABLE}</p>
        </div>

        <Separator />

        {/* School Info */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">School Info</p>
          <p className="text-sm">
            {order?.school ?? NOT_AVAILABLE} &bull; {order?.class ?? NOT_AVAILABLE} &bull; Section {order?.section ?? NOT_AVAILABLE}
          </p>
        </div>

        <Separator />

        {/* Children */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Children</p>
          {students.map(({ student }: any, index: number) => (
            <p key={student.id} className="text-sm">
              {index + 1}. {student?.name ?? NOT_AVAILABLE}
            </p>
          ))}
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <p>Thanks for your order!</p>
          <p className="font-semibold text-black">Order will not be taken back</p>
        </div>

      </CardContent>
    </Card>
  );
}