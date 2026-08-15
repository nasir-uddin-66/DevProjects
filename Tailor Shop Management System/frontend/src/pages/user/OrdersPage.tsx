// User OrdersPage - shows all orders with filter tabs

import { useState, useEffect } from "react";
import { Link } from "react-router";
import Layout from "../../components/common/Layout";
import UserSidebar from "../../components/user/UserSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../api/services";
import type { Order, OrderStatus } from "../../types";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    loadOrders();
  }, [user, activeTab]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let allOrders = await orderService.getOrders(user.id, user.role);
      if (activeTab !== "all") {
        allOrders = allOrders.filter((o) => o.status === activeTab);
      }
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "received", label: "Received" },
    { value: "re-processing", label: "Re-Processing" },
    { value: "canceled", label: "Canceled" },
  ];

  return (
    <Layout sidebar={<UserSidebar />} title="">
      <div className="flex-1 lg:px-15">
        <div className="max-w-6xl mx-auto p-5 lg:py-10">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] rounded-t-xl p-6 text-white mb-0">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-receipt"></i>
              My Orders
            </h1>
            <p className="text-white opacity-90 mt-2">
              Track and manage all your orders
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-[#282424] border-x border-b border-[#1fb854] rounded-b-xl px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === tab.value
                    ? "bg-[#1fb854] text-white"
                    : "bg-[#1b1717] text-[#30ce67] hover:bg-[#1fb854] hover:text-white border border-[#1fb854]"
                    }`}
                  onClick={() => setActiveTab(tab.value as OrderStatus | "all")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : orders.length === 0 ? (
              <EmptyState message="No orders found" />
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="hidden md:table table-zebra w-full bg-[#282424] border border-[#1fb854] rounded-lg">
                  <thead>
                    <tr className="text-[#1fb854] bg-[#1b1717]">
                      <th>Order ID</th>
                      <th>Dress Type</th>
                      <th>Delivery Date</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#30ce67]">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-[#1b1717] transition"
                      >
                        <td className="font-mono text-xs font-semibold">
                          {order.id}
                        </td>
                        <td className="capitalize font-semibold">
                          {order.dressType.replace("_", " ")}
                        </td>
                        <td>
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </td>
                        <td>
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td>
                          <StatusBadge
                            status={order.paymentStatus}
                            type="payment"
                          />
                        </td>
                        <td className="font-semibold">৳{order.totalAmount}</td>
                        <td>
                          <Link
                            to={`/user/orders/${order.id}`}
                            className="btn btn-xs bg-[#1fb854] hover:bg-[#178a3f] text-white border-0"
                          >
                            <i className="fa-solid fa-eye"></i> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#282424] rounded-lg p-4 border border-[#1fb854] space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[#54c07a] font-mono text-xs mb-1">
                            {order.id}
                          </p>
                          <p className="capitalize text-[#30ce67] font-semibold">
                            {order.dressType.replace("_", " ")}
                          </p>
                        </div>
                        <StatusBadge status={order.status} type="order" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-[#30ce67]">
                        <div>
                          <p className="text-[#1fb854] text-xs font-semibold">Delivery</p>
                          <p>{new Date(order.deliveryDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[#1fb854] text-xs font-semibold">Amount</p>
                          <p>৳{order.totalAmount}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[#1fb854] text-xs font-semibold">Payment</p>
                          <StatusBadge status={order.paymentStatus} type="payment" />
                        </div>
                      </div>

                      <Link
                        to={`/user/orders/${order.id}`}
                        className="btn btn-sm bg-[#1fb854] hover:bg-[#178a3f] text-white border-0 w-full"
                      >
                        <i className="fa-solid fa-eye"></i> View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
