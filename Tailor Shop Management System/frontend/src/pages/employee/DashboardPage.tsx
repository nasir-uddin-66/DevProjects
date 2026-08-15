// Employee DashboardPage

import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../api/services";
import type { Order } from "../../types";

export default function EmployeeDashboardPage() {
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
      const assignedOrders = await orderService.getOrders(user.id, "employee");
      setOrders(assignedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Assigned Orders",
      count: orders.length,
      icon: <i className="fa-solid fa-briefcase"></i>,
    },
    {
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
      icon: <i className="fa-solid fa-clock"></i>,
    },
    {
      label: "Processing",
      count: orders.filter((o) => o.status === "processing").length,
      icon: <i className="fa-solid fa-cog"></i>,
    },
    {
      label: "Completed",
      count: orders.filter((o) => o.status === "completed").length,
      icon: <i className="fa-solid fa-check-circle"></i>,
    },
  ];

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const processingOrders = orders.filter(
    (o) => o.status === "processing"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  return (
    <Layout sidebar={<EmployeeSidebar />}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen bg-[#1b1717]">
          {/* Header Section */}
          <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome, {user?.fullName}!
              </h2>
              <p className="text-white opacity-90">Here's your work overview</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="max-w-6xl mx-auto px-5 lg:px-0 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* Pending Orders */}
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-xl p-8 border border-[#f59e0b]">
                <h3 className="text-[#f59e0b] font-bold text-lg mb-4">
                  <i className="fa-solid fa-clock mr-2"></i>
                  Pending Orders
                </h3>
                <p className="text-4xl font-bold text-[#f59e0b]">
                  {pendingOrders}
                </p>
                <p className="text-[#30ce67] text-sm mt-2">
                  Awaiting your action
                </p>
              </div>

              {/* In Progress */}
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-xl p-8 border border-[#8b5cf6]">
                <h3 className="text-[#8b5cf6] font-bold text-lg mb-4">
                  <i className="fa-solid fa-cog mr-2"></i>
                  In Progress
                </h3>
                <p className="text-4xl font-bold text-[#8b5cf6]">
                  {processingOrders}
                </p>
                <p className="text-[#30ce67] text-sm mt-2">
                  Currently working on
                </p>
              </div>

              {/* Completed Orders */}
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-xl p-8 border border-[#54c07a]">
                <h3 className="text-[#54c07a] font-bold text-lg mb-4">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Completed Orders
                </h3>
                <p className="text-4xl font-bold text-[#54c07a]">
                  {completedOrders}
                </p>
                <p className="text-[#30ce67] text-sm mt-2">
                  Total finished work
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-12 bg-[#282424] rounded-xl p-8 border border-[#1fb854]">
              <h3 className="text-[#54c07a] font-bold text-lg mb-6">
                <i className="fa-solid fa-info-circle mr-2"></i>
                Work Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1fb854] rounded-lg flex items-center justify-center text-white text-xl">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-sm">Total Assigned</p>
                    <p className="text-2xl font-bold text-[#1fb854]">
                      {orders.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center text-white text-xl">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-sm">Work Rate</p>
                    <p className="text-2xl font-bold text-[#f59e0b]">
                      {orders.length > 0
                        ? `${Math.round(
                            (completedOrders / orders.length) * 100
                          )}%`
                        : "0%"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#54c07a] rounded-lg flex items-center justify-center text-white text-xl">
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-sm">Specialization</p>
                    <p className="text-2xl font-bold text-[#54c07a]">
                      {user?.specialization || "Tailor"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
