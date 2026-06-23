import {
  CheckCircle2,
  Package,
  Box,
  Truck,
  Home,
  ArrowLeft,
} from "lucide-react";

const ORDER_STEPS = [
  "ORDER_PLACED",
  "PACKAGING_DONE",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const stepIcons = [
  Package,
  Box,
  Truck,
  Home,
];

export function OrderTracking({
  orders,
  onBack,
}: {
  orders: any;
  onBack: () => void;
}) {
  const order = orders[0]
  const currentStep = ORDER_STEPS.indexOf(
    order.status
  );
  

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 grid place-items-center">
      <div className="w-[95%] md:w-2/3 bg-white rounded-3xl p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Order Tracking
            </h1>

            <p className="text-gray-500 mt-1">
              Order ID: {order.id}
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
            {order.status.replaceAll("_", " ")}
          </span>
        </div>

        {/* Progress Tracker */}

        <div className="relative mb-14">
          <div className="absolute top-6 left-0 w-full h-1 bg-gray-200" />

          <div
            className="absolute top-6 left-0 h-1 bg-green-500 transition-all"
            style={{
              width: `${
                (currentStep /
                  (ORDER_STEPS.length - 1)) *
                100
              }%`,
            }}
          />

          <div className="relative flex justify-between">
            {ORDER_STEPS.map((step, index) => {
              const Icon = stepIcons[index];

              const completed =
                index <= currentStep;

              return (
                <div
                  key={step}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white
                    ${
                      completed
                        ? "border-green-500 text-green-500"
                        : "border-gray-300 text-gray-300"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>

                  <span
                    className={`text-xs mt-3 text-center max-w-[100px]
                    ${
                      completed
                        ? "text-green-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {step.replaceAll("_", " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-5">
            <h3 className="font-semibold mb-4">
              Student Details
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                <strong>School:</strong>{" "}
                {order.school}
              </p>

              <p>
                <strong>Class:</strong>{" "}
                {order.class}
              </p>

              <p>
                <strong>Section:</strong>{" "}
                {order.section}
              </p>

              <p>
                <strong>Academic Year:</strong>{" "}
                {order.academicYear}
              </p>
            </div>
          </div>

          <div className="border rounded-2xl p-5">
            <h3 className="font-semibold mb-4">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Order ID:</strong>{" "}
                {order.id}
              </p>

              <p>
                <strong>Total:</strong> ₹
                {order.totalAmount}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {order.phone}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {order.status.replaceAll("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}