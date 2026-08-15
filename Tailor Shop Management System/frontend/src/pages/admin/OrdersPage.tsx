// Admin OrdersPage - manage all orders

import { useState, useEffect } from "react";
import { Link } from "react-router";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { orderService } from "../../api/services";
import type { Order, OrderStatus } from "../../types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let allOrders = await orderService.getOrders(undefined, "admin");
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
    { value: "all", label: "All Orders", icon: "fa-list" },
    { value: "pending", label: "Pending", icon: "fa-clock" },
    { value: "processing", label: "Processing", icon: "fa-cog" },
    { value: "completed", label: "Completed", icon: "fa-check-circle" },
    { value: "received", label: "Received", icon: "fa-inbox" },
    {
      value: "re-processing",
      label: "Re-Processing",
      icon: "fa-arrow-rotate-left",
    },
    { value: "canceled", label: "Canceled", icon: "fa-ban" },
  ];

  return (
    <Layout sidebar={<AdminSidebar />}>
      <div className="min-h-screen bg-[#1b1717]">
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              All Orders
            </h2>
            <p className="text-white opacity-90">
              Manage and monitor all customer orders in the system
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-5 lg:px-0 py-12">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as OrderStatus | "all")}
                className={`px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2 ${
                  activeTab === tab.value
                    ? "bg-[#1fb854] text-white shadow-lg shadow-[#1fb854]"
                    : "bg-[#282424] text-[#30ce67] border border-[#1fb854] hover:bg-[#1b1717]"
                }`}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders Display */}
          {loading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <EmptyState
              message={`No ${
                activeTab !== "all" ? activeTab : ""
              } orders found`}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="table w-full bg-[#282424] border border-[#1fb854] rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1fb854] to-[#178a3f] text-white">
                      <th className="text-white">Order ID</th>
                      <th className="text-white">Customer</th>
                      <th className="text-white">Dress Type</th>
                      <th className="text-white">Delivery Date</th>
                      <th className="text-white">Status</th>
                      <th className="text-white">Payment</th>
                      <th className="text-white">Amount</th>
                      <th className="text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#30ce67]">
                    {orders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className={
                          idx % 2 === 0 ? "bg-[#282424]" : "bg-[#1b1717]"
                        }
                      >
                        <td className="font-mono text-xs text-[#54c07a]">
                          {order.id}
                        </td>
                        <td>{order.customerName}</td>
                        <td className="capitalize">
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
                        <td className="font-semibold text-[#54c07a]">
                          ৳{order.totalAmount}
                        </td>
                        <td>
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="btn btn-xs btn-primary hover:shadow-lg hover:shadow-[#1fb854]"
                          >
                            <i className="fa-solid fa-eye"></i> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
                        <p className="text-[#30ce67] font-semibold">
                          {order.customerName}
                        </p>
                      </div>
                      <StatusBadge status={order.status} type="order" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-[#30ce67]">
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Dress Type
                        </p>
                        <p className="capitalize">
                          {order.dressType.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Delivery
                        </p>
                        <p>
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Amount
                        </p>
                        <p className="font-semibold">৳{order.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Payment
                        </p>
                        <StatusBadge
                          status={order.paymentStatus}
                          type="payment"
                        />
                      </div>
                    </div>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="btn btn-sm btn-primary w-full"
                    >
                      <i className="fa-solid fa-eye"></i> View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {orders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#1fb854]">
                <p className="text-[#30ce67] text-sm mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-[#1fb854]">
                  {orders.length}
                </p>
              </div>
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#f59e0b]">
                <p className="text-[#30ce67] text-sm mb-2">
                  Pending/Processing
                </p>
                <p className="text-3xl font-bold text-[#f59e0b]">
                  {
                    orders.filter(
                      (o) =>
                        o.status === "pending" || o.status === "processing",
                    ).length
                  }
                </p>
              </div>
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#54c07a]">
                <p className="text-[#30ce67] text-sm mb-2">Completed</p>
                <p className="text-3xl font-bold text-[#54c07a]">
                  {orders.filter((o) => o.status === "completed").length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
