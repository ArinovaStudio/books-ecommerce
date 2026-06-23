import axios from "axios";
import { useEffect, useState } from "react";
import {
  Package,
  School,
  Phone,
  ChevronRight,
  LucideXCircle,
} from "lucide-react";
import { OrderTracking } from "./OrderTracking";

type Order = {
  id: string;
  school: string;
  class: string;
  section: string;
  academicYear: string;
  phone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function TrackOrders({
  userId,
  close,
}: {
  userId: string;
  close: () => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  async function getOrders() {
    try {
      const res = await axios.get(`/api/order?userId=${userId}`);

      if (res.status === 200) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectOrder(orderId: string) {
    try {
      const res = await axios.get(`/api/order/${orderId}`);

      if (res.status === 200) {
        setSelectedOrder(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (userId) {
      getOrders();
    }
  }, [userId]);

  if (selectedOrder) {
    return (
      <OrderTracking
        orders={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 grid place-items-center">
      <div className="w-[90%] md:w-3/5 h-[80vh] rounded-3xl bg-white p-8 overflow-hidden relative">
        <div onClick={close} className="w-6 h-6 absolute right-8 top-8 cursor-pointer">
            <LucideXCircle size={24} color="#fa5c77" className="cursor-pointer"/>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Track Your Order
        </h1>

        <p className="text-gray-500 mb-8">
          Select an order to view tracking details
        </p>

        <div className="overflow-y-auto h-[calc(100%-80px)] space-y-4 pr-2">
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No orders found
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <button
                key={order.id}
                onClick={() => handleSelectOrder(order.id)}
                className="w-full border border-gray-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Order #{order.id}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <ChevronRight size={22} />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <School size={18} />
                    <span className="text-sm">
                      {order.school}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package size={18} />
                    <span className="text-sm">
                      {order.class} - {order.section}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span className="text-sm">
                      {order.phone}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="font-medium">
                    ₹{order.totalAmount}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {order.status.replaceAll("_", " ")}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}