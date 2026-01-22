"use client";
export default function ReceiptBase({order}: {order: any}) {
  return (
    <div id={"receipt"} className="min-h-screen mx-auto -left-[9999px] absolute bg-white rounded-md h-full bg-gray-100 p-6 flex justify-center">
      <div className="relative h-full w-full max-w-4xl  p-8 text-sm text-gray-700">
        {/* Logo */}
        <div className="mb-6">
          <div className="inline-block border border-blue-300 text-blue-500 px-4 py-2 rounded font-semibold">
            Glow Nest
          </div>
        </div>

        {/* Seller / Buyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Seller */}
          <div className="border rounded p-4">
            <p className="text-blue-500 font-semibold mb-2">Your details</p>
            <p className="text-xs text-gray-400">FROM</p>
            <p className="font-semibold">Seller</p>
            <p>ABC Seller</p>
            <p>Seller Address, City</p>
            <p>United States of America</p>
            <p className="mt-2">seller@seller-email.com</p>
            <p>800-234-0012</p>
          </div>

          {/* Buyer */}
          <div className="border rounded p-4">
            <p className="text-blue-500 font-semibold mb-2">
              Client&apos;s details
            </p>
            <p className="text-xs text-gray-400">TO</p>
            <p className="font-semibold">Buyer</p>
            <p>{order?.student?.name}</p>
            <p>{order?.landmark}</p>
            <p>India</p>
            <p className="mt-2">{order?.student?.parentEmail}</p>
            <p>{order?.phone}</p>
          </div>
        </div>

        {/* Receipt Meta */}
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <p>
              <span className="font-semibold">Receipt No :</span> {order?.id}
            </p>
            <p>
              <span className="font-semibold">Receipt Date :</span> {(new Date(order?.createdAt)).toLocaleDateString()}
            </p>
          </div>

          {/* <div>
            <p>
              <span className="font-semibold">Valid till :</span> Jan 30th, 2022
            </p>
          </div> */}
        </div>

        {/* Items Table */}
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3">Item</th>
                <th className="text-center px-4 py-3">HRS/QTY</th>
                <th className="text-center px-4 py-3">Rate</th>
                <th className="text-right px-4 py-3">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order?.items?.map((item: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">{item.product.name}</td>
                  <td className="text-center px-4 py-3">{item.quantity}</td>
                  <td className="text-center px-4 py-3">₹{item.price}</td>
                  <td className="text-right px-4 py-3">₹{item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mt-6">
          <div className="w-full max-w-sm border rounded p-4">
            <p className="font-semibold text-center mb-3">
              Invoice Summary
            </p>

            {/* <div className="flex justify-between border-t py-2">
              <span>Subtotal</span>
              <span>USD 530.00</span>
            </div> */}

            <div className="flex justify-between border-t py-2 font-semibold">
              <span>Total</span>
              <span>₹{order?.items?.map((item: any)=>item.price*item.quantity)?.reduce((acummulator: number,curr: number)=>acummulator+curr,0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
