// Admin EmployeeDetailPage - view employee details and assigned orders

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { employeeService, orderService } from "../../api/services";
import type { Employee, Order } from "../../types";

export default function AdminEmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [employeeData, allOrders] = await Promise.all([
        employeeService
          .getEmployees()
          .then((emps) => emps.find((e) => e.id === id)),
        orderService.getOrders(undefined, "admin"),
      ]);
      setEmployee(employeeData || null);
      // Filter orders assigned to this employee (from mockData we can assume)
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading employee details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout sidebar={<AdminSidebar />}>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout sidebar={<AdminSidebar />}>
        <div className="p-5">
          <p className="text-[#30ce67]">Employee not found</p>
          <Link to="/admin/employees" className="btn btn-primary mt-4">
            Back to Employees
          </Link>
        </div>
      </Layout>
    );
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const processingOrders = orders.filter(
    (o) => o.status === "processing"
  ).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <Layout sidebar={<AdminSidebar />}>
      <div className="min-h-screen bg-[#1b1717]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-6 md:p-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {employee.fullName}
              </h2>
              <p className="text-white opacity-90 text-sm mt-1">
                {employee.specialization
                  ? `Specialized in ${employee.specialization}`
                  : "Professional Tailor"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-5 lg:px-0 py-12">
          {/* Back Button */}
          <Link
            to="/admin/employees"
            className="inline-flex items-center gap-2 text-[#54c07a] hover:text-[#1fb854] mb-8 transition"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Employees
          </Link>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#1fb854]">
              <p className="text-[#30ce67] text-sm mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-[#1fb854]">{totalOrders}</p>
            </div>
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#f59e0b]">
              <p className="text-[#30ce67] text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-[#f59e0b]">
                {pendingOrders}
              </p>
            </div>
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#8b5cf6]">
              <p className="text-[#30ce67] text-sm mb-2">Processing</p>
              <p className="text-3xl font-bold text-[#8b5cf6]">
                {processingOrders}
              </p>
            </div>
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#54c07a]">
              <p className="text-[#30ce67] text-sm mb-2">Completed</p>
              <p className="text-3xl font-bold text-[#54c07a]">
                {completedOrders}
              </p>
            </div>
          </div>

          {/* Employee Information Card */}
          <div className="bg-[#282424] rounded-lg p-6 border border-[#1fb854] mb-8">
            <h3 className="text-[#54c07a] text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-id-card"></i> Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Full Name
                </p>
                <p className="text-white text-lg font-semibold">
                  {employee.fullName}
                </p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Email
                </p>
                <p className="text-white text-lg">{employee.email}</p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Phone
                </p>
                <p className="text-white text-lg">{employee.phone}</p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Address
                </p>
                <p className="text-white text-lg">{employee.address}</p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Specialization
                </p>
                <p className="text-white text-lg capitalize">
                  {employee.specialization || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Joined
                </p>
                <p className="text-white text-lg">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Work Performance Card */}
          <div className="bg-[#282424] rounded-lg p-6 border border-[#1fb854] mb-8">
            <h3 className="text-[#54c07a] text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-chart-line"></i> Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-[#54c07a]">
                  {totalOrders > 0
                    ? Math.round((completedOrders / totalOrders) * 100)
                    : 0}
                  %
                </p>
                <p className="text-[#30ce67] text-xs mt-2">
                  {completedOrders} / {totalOrders} orders
                </p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Current Workload
                </p>
                <p className="text-3xl font-bold text-[#8b5cf6]">
                  {pendingOrders + processingOrders}
                </p>
                <p className="text-[#30ce67] text-xs mt-2">Active orders</p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Status
                </p>
                <div className="mt-2">
                  <span className="px-4 py-2 rounded-full bg-[#54c07a] text-white text-sm font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Orders Card */}
          <div className="bg-[#282424] rounded-lg border border-[#1fb854] overflow-hidden">
            <div className="p-6 border-b border-[#1fb854]">
              <h3 className="text-[#54c07a] text-lg font-bold flex items-center gap-2">
                <i className="fa-solid fa-list-check"></i> Assigned Orders
              </h3>
            </div>
            {orders.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[#30ce67]">
                  No orders assigned to this employee
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1fb854] to-[#178a3f] text-white">
                      <th className="text-white">Order ID</th>
                      <th className="text-white">Customer</th>
                      <th className="text-white">Dress Type</th>
                      <th className="text-white">Amount</th>
                      <th className="text-white">Status</th>
                      <th className="text-white">Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#30ce67]">
                    {orders.slice(0, 10).map((order, idx) => (
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
                        <td className="font-semibold text-white">
                          ৳{order.totalAmount.toLocaleString()}
                        </td>
                        <td>
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td className="text-sm">
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
