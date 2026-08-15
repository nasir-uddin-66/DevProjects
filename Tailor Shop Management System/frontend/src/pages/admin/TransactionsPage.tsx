// Admin TransactionsPage - view all transaction details

import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { orderService } from "../../api/services";
import { printSection } from "../../utils/printHelpers";
import type { Order } from "../../types";

export default function AdminTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const allOrders = await orderService.getOrders(undefined, "admin");
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.paidAmount, 0);
  const totalDue = orders.reduce(
    (sum, order) => sum + (order.totalAmount - order.paidAmount),
    0,
  );
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <Layout sidebar={<AdminSidebar />}>
      <div className="min-h-screen bg-[#1b1717]">
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Transaction Report
                </h2>
                <p className="text-white opacity-90">
                  Complete financial overview of all customer orders
                </p>
              </div>
              <button
                onClick={() => printSection("print-section")}
                className="btn btn-outline border-white text-white hover:bg-white hover:text-[#1fb854] whitespace-nowrap"
              >
                <i className="fa-solid fa-print"></i> Print Report
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-5 lg:px-0 py-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-linear-to-br from-[#1fb854] to-[#178a3f] rounded-lg p-8 border-2 border-green-400 hover:shadow-2xl transition">
              <p className="text-white opacity-80 text-sm font-semibold mb-2 uppercase">
                Total Amount
              </p>
              <p className="text-white font-bold text-4xl">
                ৳{totalAmount.toLocaleString()}
              </p>
              <p className="text-white opacity-70 text-xs mt-3">
                All orders combined
              </p>
            </div>
            <div className="bg-linear-to-br from-green-600 to-green-400 rounded-lg p-8 border-2 border-green-400 hover:shadow-2xl transition">
              <p className="text-white opacity-80 text-sm font-semibold mb-2 uppercase">
                Total Revenue
              </p>
              <p className="text-white font-bold text-4xl">
                ৳{totalRevenue.toLocaleString()}
              </p>
              <p className="text-white opacity-70 text-xs mt-3">
                Amount collected
              </p>
            </div>
            <div className="bg-linear-to-br from-orange-600 to-orange-400 rounded-lg p-8 border-2 border-orange-400 hover:shadow-2xl transition">
              <p className="text-white opacity-80 text-sm font-semibold mb-2 uppercase">
                Total Refunded Amount
              </p>
              <p className="text-white font-bold text-4xl">
                ৳{totalDue.toLocaleString()}
              </p>
              {/* <p className="text-white opacity-70 text-xs mt-3">
                Pending collection
              </p> */}
            </div>
          </div>

          {/* Transaction Table */}
          {loading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <EmptyState message="No transactions found" />
          ) : (
            <div
              id="print-section"
              className="bg-[#282424] rounded-lg border border-[#1fb854] overflow-hidden"
            >
              {/* Print Header */}
              <div className="print-header no-print hidden">
                <h2 className="print-title">Transaction Report</h2>
                <p className="print-subtitle">Financial Overview</p>
                <p className="print-timestamp">
                  Generated on {new Date().toLocaleDateString()} at{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>

              {/* Summary Section for Print */}
              <div className="hidden print:block p-6 border-b border-[#1fb854]">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Total Amount
                    </p>
                    <p className="text-lg font-bold">
                      ৳{totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ৳{totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Total Due
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      ৳{totalDue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1fb854] to-[#178a3f] text-white">
                      <th className="text-white">Order ID</th>
                      <th className="text-white">Customer</th>
                      <th className="text-white">Date</th>
                      <th className="text-white">Total Amount</th>
                      <th className="text-white">Paid Amount</th>
                      <th className="text-white">Refunded Amount</th>
                      <th className="text-white">Status</th>
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
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="font-semibold text-white">
                          ৳{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="font-semibold text-green-400">
                          ৳{order.paidAmount.toLocaleString()}
                        </td>
                        <td className="font-semibold text-orange-400">
                          ৳
                          {(
                            order.totalAmount - order.paidAmount
                          ).toLocaleString()}
                        </td>
                        <td>
                          <StatusBadge
                            status={order.paymentStatus}
                            type="payment"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-linear-to-r from-[#1fb854] to-[#178a3f] text-white font-semibold">
                    <tr>
                      <td colSpan={3} className="text-right p-4">
                        Total:
                      </td>
                      <td className="p-4">৳{totalAmount.toLocaleString()}</td>
                      <td className="p-4 text-green-300">
                        ৳{totalRevenue.toLocaleString()}
                      </td>
                      <td className="p-4 text-orange-300">
                        ৳{totalDue.toLocaleString()}
                      </td>
                      <td className="p-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#1b1717] rounded-lg p-4 border border-[#1fb854] space-y-3"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[#54c07a] font-mono text-xs mb-1">
                          {order.id}
                        </p>
                        <p className="text-[#30ce67] font-semibold">
                          {order.customerName}
                        </p>
                      </div>
                      <StatusBadge
                        status={order.paymentStatus}
                        type="payment"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Date
                        </p>
                        <p className="text-[#30ce67]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Total
                        </p>
                        <p className="text-white font-semibold">
                          ৳{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Paid
                        </p>
                        <p className="text-green-400 font-semibold">
                          ৳{order.paidAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Due
                        </p>
                        <p className="text-orange-400 font-semibold">
                          ৳
                          {(
                            order.totalAmount - order.paidAmount
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile Totals */}
                <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] rounded-lg p-4 mt-6 text-white space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-bold">
                      ৳{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Revenue:</span>
                    <span className="font-bold text-green-300">
                      ৳{totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Due:</span>
                    <span className="font-bold text-orange-300">
                      ৳{totalDue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
