// User DashboardPage - shows order statistics

import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import UserSidebar from "../../components/user/UserSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../api/services";
import type { Order } from "../../types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allOrders = await orderService.getOrders(user.id, user.role);
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Orders",
      count: orders.length,
      icon: <i className="fa-solid fa-check-double"></i>,
    },
    {
      label: "Pending Orders",
      count: orders.filter((o) => o.status === "pending").length,
      icon: <i className="fa-solid fa-arrows-rotate"></i>,
    },
    {
      label: "Canceled Orders",
      count: orders.filter((o) => o.status === "canceled").length,
      icon: <i className="fa-solid fa-x transition"></i>,
    },
    {
      label: "Received Orders",
      count: orders.filter((o) => o.status === "received").length,
      icon: <i className="fa-brands fa-stack-overflow"></i>,
    },
    {
      label: "Completed Orders",
      count: orders.filter((o) => o.status === "completed").length,
      icon: <i className="fa-regular fa-circle-check"></i>,
    },
  ];

  return (
    <Layout sidebar={<UserSidebar />} title="">
      <div className="flex-1 lg:px-15">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="min-h-screen bg-[#1b1717]">
            {/* Header Section */}
            <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-8 md:p-12">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome Back, {user?.fullName}!
                </h2>
                <p className="text-white opacity-90">
                  Here's your order overview
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-6xl mx-auto px-5 lg:px-0 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-[#282424] rounded-xl p-6 border border-[#1fb854] hover:shadow-lg hover:shadow-[#1fb854] transition duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-[#1fb854] rounded-lg flex items-center justify-center text-white text-xl">
                        {stat.icon}
                      </div>
                      <span className="text-xs text-[#30ce67] bg-[#1b1717] px-3 py-1 rounded-full">
                        {stat.count}
                      </span>
                    </div>
                    <h3 className="text-[#54c07a] font-semibold text-sm mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-3xl font-bold text-[#1fb854]">
                      {stat.count}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {/* Total Amount */}
                <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-xl p-8 border border-[#1fb854]">
                  <h3 className="text-[#54c07a] font-bold text-lg mb-4">
                    <i className="fa-solid fa-bangladeshi-taka-sign mr-2"></i>
                    Total Amount Spent
                  </h3>
                  <p className="text-4xl font-bold text-[#1fb854]">
                    ৳{orders.reduce((sum, order) => sum + order.totalAmount, 0)}
                  </p>
                  <p className="text-[#30ce67] text-sm mt-2">
                    Across {orders.length} orders
                  </p>
                </div>

                {/* Paid Amount */}
                <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-xl p-8 border border-[#54c07a]">
                  <h3 className="text-[#54c07a] font-bold text-lg mb-4">
                    <i className="fa-solid fa-check-circle mr-2"></i>
                    Amount Paid
                  </h3>
                  <p className="text-4xl font-bold text-[#54c07a]">
                    ৳{orders.reduce((sum, order) => sum + order.paidAmount, 0)}
                  </p>
                  <p className="text-[#30ce67] text-sm mt-2">
                    {(
                      (orders.reduce(
                        (sum, order) => sum + order.paidAmount,
                        0
                      ) /
                        (orders.reduce(
                          (sum, order) => sum + order.totalAmount,
                          0
                        ) || 1)) *
                      100
                    ).toFixed(1)}
                    % paid
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-12">
                <h3 className="text-[#54c07a] font-bold text-lg mb-6">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-[#1fb854] hover:bg-[#178a3f] text-white font-semibold py-3 px-6 rounded-lg transition">
                    <i className="fa-solid fa-plus mr-2"></i>
                    New Order
                  </button>
                  <button className="bg-[#282424] hover:bg-[#1b1717] text-[#54c07a] border border-[#1fb854] font-semibold py-3 px-6 rounded-lg transition">
                    <i className="fa-solid fa-list mr-2"></i>
                    View Orders
                  </button>
                  <button className="bg-[#282424] hover:bg-[#1b1717] text-[#54c07a] border border-[#1fb854] font-semibold py-3 px-6 rounded-lg transition">
                    <i className="fa-solid fa-user mr-2"></i>
                    My Profile
                  </button>
                </div>
              </div>

              {/* Status Distribution */}
              {orders.length > 0 && (
                <div className="mt-12 bg-[#282424] rounded-xl p-8 border border-[#1fb854]">
                  <h3 className="text-[#54c07a] font-bold text-lg mb-6">
                    Order Status Distribution
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="bg-[#1fb854] bg-opacity-20 rounded-lg p-4 mb-2">
                        <p className="text-2xl font-bold text-white">
                          {orders.filter((o) => o.status === "pending").length}
                        </p>
                      </div>
                      <p className="text-[#30ce67] text-sm">Pending</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-[#54c07a] bg-opacity-20 rounded-lg p-4 mb-2">
                        <p className="text-2xl font-bold text-white">
                          {
                            orders.filter((o) => o.status === "processing")
                              .length
                          }
                        </p>
                      </div>
                      <p className="text-[#30ce67] text-sm">Processing</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-500 bg-opacity-20 rounded-lg p-4 mb-2">
                        <p className="text-2xl font-bold text-white">
                          {
                            orders.filter((o) => o.status === "completed")
                              .length
                          }
                        </p>
                      </div>
                      <p className="text-[#30ce67] text-sm">Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4 mb-2">
                        <p className="text-2xl font-bold text-white">
                          {orders.filter((o) => o.status === "received").length}
                        </p>
                      </div>
                      <p className="text-[#30ce67] text-sm">Received</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-red-500 bg-opacity-20 rounded-lg p-4 mb-2">
                        <p className="text-2xl font-bold text-white">
                          {orders.filter((o) => o.status === "canceled").length}
                        </p>
                      </div>
                      <p className="text-[#30ce67] text-sm">Canceled</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
