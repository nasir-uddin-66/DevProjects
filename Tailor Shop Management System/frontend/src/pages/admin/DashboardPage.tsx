// Admin DashboardPage

import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { orderService, userService, employeeService } from "../../api/services";
import type { Order } from "../../types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    unreceiverdOrders: 0,
    canceledOrders: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [orders, customers, employees] = await Promise.all([
        orderService.getOrders(undefined, "admin"),
        userService.getUsers(),
        employeeService.getEmployees(),
      ]);

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        processingOrders: orders.filter((o) => o.status === "processing")
          .length,
        unreceiverdOrders: orders.filter((o) => o.status === "received").length,
        canceledOrders: orders.filter((o) => o.status === "canceled").length,
        totalCustomers: customers.length,
        totalEmployees: employees.length,
        completedOrders: orders.filter((o) => o.status === "completed").length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const mainStats = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: "fa-shopping-bag",
      color: "from-blue-600 to-blue-400",
      borderColor: "border-blue-400",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: "fa-clock",
      color: "from-yellow-600 to-yellow-400",
      borderColor: "border-yellow-400",
    },
    {
      label: "Processing Orders",
      value: stats.processingOrders,
      icon: "fa-cog",
      color: "from-purple-600 to-purple-400",
      borderColor: "border-purple-400",
    },
    {
      label: "Received Orders",
      value: stats.unreceiverdOrders,
      icon: "fa-inbox",
      color: "from-orange-600 to-orange-400",
      borderColor: "border-orange-400",
    },
    {
      label: "Canceled Orders",
      value: stats.canceledOrders,
      icon: "fa-ban",
      color: "from-red-600 to-red-400",
      borderColor: "border-red-400",
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: "fa-check-circle",
      color: "from-green-600 to-green-400",
      borderColor: "border-green-400",
    },
  ];

  const summaryStats = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: "fa-users",
      color: "#a855f7",
    },
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: "fa-user-tie",
      color: "#f97316",
    },
  ];

  return (
    <Layout sidebar={<AdminSidebar />}>
      <div className="min-h-screen bg-[#1b1717]">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Hero Header */}
            <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-8 md:p-12">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-white text-4xl">
                    <i className="fa-solid fa-shield"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    System Dashboard
                  </h2>
                </div>
                <p className="text-white opacity-90 text-lg">
                  Monitor and manage your tailor shop operations
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-5 lg:px-0 py-12">
              {/* Primary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {mainStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`bg-linear-to-br ${stat.color} rounded-lg p-8 border-2 ${stat.borderColor} hover:shadow-2xl hover:scale-105 transition duration-300 cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-white text-4xl">
                        <i className={`fa-solid ${stat.icon}`}></i>
                      </div>
                      <div className="text-white text-xs font-bold px-3 py-1 rounded-full bg-white bg-opacity-20">
                        Total
                      </div>
                    </div>
                    <p className="text-white opacity-80 text-sm font-semibold mb-2 uppercase">
                      {stat.label}
                    </p>
                    <p className="text-white font-bold text-4xl">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Secondary Stats */}
              <div className="bg-[#282424] rounded-lg border border-[#1fb854] p-8 mb-12">
                <h3 className="text-[#54c07a] text-2xl font-bold mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-chart-bar"></i> Team Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {summaryStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-6 p-6 rounded-lg bg-linear-to-r from-[#1b1717] to-[#282424] border border-[#1fb854] hover:border-[#54c07a] transition"
                    >
                      <div
                        className="text-4xl p-4 rounded-lg"
                        style={{
                          color: stat.color,
                          backgroundColor: `${stat.color}20`,
                        }}
                      >
                        <i className={`fa-solid ${stat.icon}`}></i>
                      </div>
                      <div>
                        <p className="text-[#30ce67] text-sm font-semibold uppercase mb-1">
                          {stat.label}
                        </p>
                        <p className="text-white font-bold text-3xl">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats Summary */}
              <div className="bg-linear-to-r from-[#282424] to-[#1b1717] rounded-lg p-8 border border-[#1fb854]">
                <h3 className="text-[#54c07a] text-xl font-bold mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-info-circle"></i> Business Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-[#30ce67] text-sm font-semibold uppercase mb-2">
                      Completion Rate
                    </p>
                    <p className="text-[#54c07a] text-3xl font-bold">
                      {stats.totalOrders > 0
                        ? Math.round(
                            (stats.completedOrders / stats.totalOrders) * 100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-sm font-semibold uppercase mb-2">
                      Active Orders
                    </p>
                    <p className="text-[#f59e0b] text-3xl font-bold">
                      {stats.totalOrders - stats.completedOrders}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-sm font-semibold uppercase mb-2">
                      Avg Orders per Employee
                    </p>
                    <p className="text-[#1fb854] text-3xl font-bold">
                      {stats.totalEmployees > 0
                        ? (stats.totalOrders / stats.totalEmployees).toFixed(1)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
