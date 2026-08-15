// Admin CustomerDetailPage - view customer details

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { userService, orderService } from "../../api/services";
import type { User, Order } from "../../types";

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<User | null>(null);
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
      const [customerData, allOrders] = await Promise.all([
        userService.getUsers().then((users) => users.find((u) => u.id === id)),
        orderService.getOrders(id, "admin"),
      ]);
      setCustomer(customerData || null);
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading customer details:", error);
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

  if (!customer) {
    return (
      <Layout sidebar={<AdminSidebar />}>
        <div className="p-5">
          <p className="text-[#30ce67]">Customer not found</p>
          <Link to="/admin/customers" className="btn btn-primary mt-4">
            Back to Customers
          </Link>
        </div>
      </Layout>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  return (
    <Layout sidebar={<AdminSidebar />}>
      <div className="min-h-screen bg-[#1b1717]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-6 md:p-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {customer.fullName}
              </h2>
              <p className="text-white opacity-90 text-sm mt-1">
                Customer Profile
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-5 lg:px-0 py-12">
          {/* Back Button */}
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-2 text-[#54c07a] hover:text-[#1fb854] mb-8 transition"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Customers
          </Link>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#1fb854]">
              <p className="text-[#30ce67] text-sm mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-[#1fb854]">{totalOrders}</p>
            </div>
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#54c07a]">
              <p className="text-[#30ce67] text-sm mb-2">Completed</p>
              <p className="text-3xl font-bold text-[#54c07a]">
                {completedOrders}
              </p>
            </div>
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#f59e0b]">
              <p className="text-[#30ce67] text-sm mb-2">Total Spent</p>
              <p className="text-3xl font-bold text-[#f59e0b]">
                ৳{totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#8b5cf6]">
              <p className="text-[#30ce67] text-sm mb-2">Member Since</p>
              <p className="text-sm text-white font-semibold">
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-[#282424] rounded-lg p-6 border border-[#1fb854] mb-8">
            <h3 className="text-[#54c07a] text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-user"></i> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Full Name
                </p>
                <p className="text-white text-lg font-semibold">
                  {customer.fullName}
                </p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Email
                </p>
                <p className="text-white text-lg">{customer.email}</p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Phone
                </p>
                <p className="text-white text-lg">{customer.phone}</p>
              </div>
              <div>
                <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
                  Address
                </p>
                <p className="text-white text-lg">{customer.address}</p>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-[#282424] rounded-lg border border-[#1fb854] overflow-hidden">
            <div className="p-6 border-b border-[#1fb854]">
              <h3 className="text-[#54c07a] text-lg font-bold flex items-center gap-2">
                <i className="fa-solid fa-receipt"></i> Order History
              </h3>
            </div>
            {orders.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[#30ce67]">
                  No orders found for this customer
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1fb854] to-[#178a3f] text-white">
                      <th className="text-white">Order ID</th>
                      <th className="text-white">Dress Type</th>
                      <th className="text-white">Amount</th>
                      <th className="text-white">Status</th>
                      <th className="text-white">Payment</th>
                      <th className="text-white">Date</th>
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
                        <td className="capitalize">
                          {order.dressType.replace("_", " ")}
                        </td>
                        <td className="font-semibold text-white">
                          ৳{order.totalAmount.toLocaleString()}
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
                        <td className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
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
