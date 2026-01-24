import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image";
type ReceiptProps = {
  order?: any; 
}
const COMPANY = "Glow Nest";
const NOT_AVAILABLE = "Not Provided";


export default function Receipt({order}: ReceiptProps) {
  const subtotal = order?.items?.reduce(
    (a: number, b: any) => a + b.quantity * b.price,
    0
  )
  // const taxPercent = 18;
  // const tax = (subtotal * taxPercent) / 100
  const total = subtotal

  return (
    <Card id="receipt" className="absolute -left-[9999px] w-full max-w-4xl mx-auto rounded-xl shadow-sm">
      <CardContent className="p-6 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Image src="/logo.png" className="rounded-full" alt={COMPANY} width={100} height={100}/>
            <h2 className="text-xl font-semibold">{COMPANY}</h2>
            <p className="text-sm text-muted-foreground">
              Hyderabad, TG- 500043<br />
              contact@glow-nest.in
            </p>
          </div>

          <div className="bg-blue-500 text-white px-5 py-3 text-sm w-fit">
            <p className="font-semibold">Receipt for #{order?.id ?? NOT_AVAILABLE}</p>
            <p className="text-xs opacity-90">Transaction Date: {order?.createdAt ? (new Date(order?.createdAt)).toLocaleDateString(): NOT_AVAILABLE}</p>
          </div>
        </div>

        <Separator />

        {/* Recipient */}
        <div>
          <p className="text-sm font-semibold mb-1">RECIPIENT:</p>
          <p className="text-sm">
            <span className="text-xl font-semibold">{order?.student.parent.name ?? NOT_AVAILABLE}</span><br />
            {order?.landmark ?? NOT_AVAILABLE}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left hidden md:table-cell">
                  Description
                </th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((item: any, i: number) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="align-top p-3 font-medium">{item.product.name}</td>
                  <td className="align-top p-3 pb-0 max-md:hidden md:table-cell md:line-clamp-2! text-muted-foreground">
                    {item?.product?.description || "No description available"}
                  </td>
                  <td className="align-top p-3 text-center">{item.quantity}</td>
                  <td className="align-top p-3 text-right">₹{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-2 text-sm">
            {/* <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal?.toFixed(2)}</span>
            </div> */}
            {/* <div className="flex justify-between">
              <span>Tax ({taxPercent}%)</span>
              <span>₹{tax?.toFixed(2)}</span>
            </div> */}
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₹{total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground flex justify-between items-center pt-4">
          <p>Thanks for your business!</p>
          <p>Powered by {COMPANY}</p>
        </div>
      </CardContent>
    </Card>
  )
}
