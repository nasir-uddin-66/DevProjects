// Admin OrderDetailPage - view and edit order

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { orderService, employeeService } from "../../api/services";
import { ORDER_STATUSES, getAllowedNextStatuses } from "../../utils/constants";
import { printSection } from "../../utils/printHelpers";
import type { Order, OrderStatus } from "../../types";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [employees, setEmployees] = useState<any[]>([]);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder();
      loadEmployees();
    }
  }, [id]);

  const loadEmployees = async () => {
    try {
      const employeesData = await employeeService.getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const loadOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const orderData = await orderService.getOrderById(id);
      if (orderData) {
        setOrder(orderData);
        setStatus(orderData.status);
        setAssignedEmployeeId(orderData.assignedEmployeeId || "");
      }
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!id || !order) return;
    setUpdating(true);
    try {
      await orderService.updateOrder(id, { status });
      toast.success("Order status updated!");
      loadOrder();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignWork = async () => {
    if (!id || !assignedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }
    setAssigning(true);
    try {
      await orderService.updateOrder(id, {
        assignedEmployeeId,
        status: "processing",
      });
      toast.success("Order assigned to employee successfully!");
      loadOrder();
    } catch (error) {
      toast.error("Failed to assign order");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <Layout sidebar={<AdminSidebar />}>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout sidebar={<AdminSidebar />}>
        <div className="p-5">
          <p className="text-[#30ce67]">Order not found</p>
          <Link to="/admin/orders" className="btn btn-primary mt-4">
            Back to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebar={<AdminSidebar />}>
      <div className="min-h-screen bg-[#1b1717]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1fb854] via-[#30ce67] to-[#178a3f] py-8 px-5 text-white shadow-lg">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold font-mono mb-2 flex items-center gap-3">
                <i className="fa-solid fa-receipt text-2xl"></i>
                Order Details
              </h1>
              <p className="text-white opacity-90 text-lg">
                Order ID:{" "}
                <span className="font-mono font-bold text-[#1b1717]">
                  {order.id}
                </span>
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                to="/admin/orders"
                className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-[#1fb854]"
              >
                <i className="fa-solid fa-arrow-left"></i> Back
              </Link>
              <button
                onClick={() => printSection("print-section")}
                className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-[#1fb854]"
              >
                <i className="fa-solid fa-print"></i> Print
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto py-8 px-5">
          <div id="print-section" className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
                <h3 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-file-contract"></i>
                  Order Information
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Dress Type
                    </p>
                    <p className="text-white font-semibold text-lg capitalize mt-1">
                      {order.dressType.replace("_", " ")}
                    </p>
                  </div>
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Delivery Date
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Urgency Level
                    </p>
                    <p
                      className={`text-lg font-semibold capitalize mt-1 ${
                        order.urgency === "express"
                          ? "text-red-400"
                          : order.urgency === "urgent"
                            ? "text-[#f59e0b]"
                            : "text-[#54c07a]"
                      }`}
                    >
                      {order.urgency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
                <h3 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-tag"></i>
                  Status Overview
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Order Status
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={order.status} type="order" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Payment Status
                    </p>
                    <div className="mt-2">
                      <StatusBadge
                        status={order.paymentStatus}
                        type="payment"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
              <h3 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                <i className="fa-solid fa-user"></i>
                Customer Information
              </h3>
              <div className="space-y-4">
                <div className="border-b border-[#1fb854] pb-3">
                  <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                    Name
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    {order.customerName}
                  </p>
                </div>
                <div className="border-b border-[#1fb854] pb-3">
                  <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                    Email
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    {order.customerEmail}
                  </p>
                </div>
                <div className="border-b border-[#1fb854] pb-3">
                  <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                    Phone
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    {order.customerPhone}
                  </p>
                </div>
                <div>
                  <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                    Address
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    {order.customerAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
              <h3 className="text-[#54c07a] font-bold text-lg mb-5 flex items-center gap-2">
                <i className="fa-solid fa-ruler"></i>
                Measurements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(order.measurements).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-linear-to-br from-[#1b1717] to-[#0f0c0c] p-5 rounded-lg border border-[#1fb854] text-center hover:border-[#54c07a] hover:shadow-md transition group"
                  >
                    <p className="text-[#30ce67] text-xs opacity-75 mb-2 uppercase font-semibold">
                      {key}
                    </p>
                    <p className="text-[#54c07a] font-bold text-2xl group-hover:text-white transition">
                      {value}
                    </p>
                    <p className="text-[#30ce67] text-xs mt-2">cm</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Image */}
            {order.referenceImage && (
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
                <h3 className="text-[#54c07a] font-bold text-lg mb-5 flex items-center gap-2">
                  <i className="fa-solid fa-image"></i>
                  Reference Image
                </h3>
                <div className="flex justify-center">
                  <img
                    src={order.referenceImage}
                    alt="Reference Design"
                    className="max-w-md max-h-96 rounded-lg border-2 border-[#1fb854] object-cover"
                  />
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {order.additionalNotes && (
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
                <h3 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-note-sticky"></i>
                  Additional Notes
                </h3>
                <p className="text-[#30ce67] leading-relaxed">
                  {order.additionalNotes}
                </p>
              </div>
            )}

            {/* Transaction Info */}
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
              <h3 className="text-[#54c07a] font-bold text-lg mb-5 flex items-center gap-2">
                <i className="fa-solid fa-receipt"></i>
                Transaction Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Total Amount
                    </p>
                    <p className="text-[#54c07a] font-bold text-2xl mt-1">
                      ৳{order.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Paid Amount
                    </p>
                    <p className="text-green-400 font-bold text-2xl mt-1">
                      ৳{order.paidAmount}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Due Amount
                    </p>
                    <p
                      className={`font-bold text-2xl mt-1 ${
                        order.totalAmount - order.paidAmount > 0
                          ? "text-[#f59e0b]"
                          : "text-[#54c07a]"
                      }`}
                    >
                      ৳{order.totalAmount - order.paidAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Order Date
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold mb-2">
                    Last Updated
                  </p>
                  <p className="text-white font-semibold text-lg mb-4">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold mb-2">
                      Payment Status
                    </p>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </div>
                </div>
              </div>
            </div>

            {/* Update Status */}
            {order.status !== "pending" && (
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-8 rounded-xl border-2 border-[#1fb854] shadow-md no-print">
                <h3 className="text-[#54c07a] font-bold text-lg mb-6 flex items-center gap-3 no-print">
                  <div className="w-10 h-10 bg-[#1fb854] rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-arrow-right text-white"></i>
                  </div>
                  Update Order Status
                </h3>

                {/* Current Status Display */}
                <div className="mb-6 p-4 bg-[#1b1717] rounded-lg border border-[#1fb854]">
                  <p className="text-[#30ce67] text-xs uppercase font-semibold mb-2">
                    Current Status
                  </p>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} type="order" />
                    <span className="text-white font-semibold capitalize">
                      {order.status.replace("-", " ")}
                    </span>
                  </div>
                </div>

                {/* Status Transition Options */}
                <div className="w-full">
                  <p className="text-[#30ce67] text-xs uppercase font-semibold mb-4">
                    Available Next Actions
                  </p>
                  {getAllowedNextStatuses(order.status).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getAllowedNextStatuses(order.status)
                        .filter((s) => s !== "canceled")
                        .map((allowedStatus) => {
                          const statusLabel = ORDER_STATUSES.find(
                            (s) => s.value === allowedStatus,
                          )?.label;
                          const isSelected = status === allowedStatus;
                          const isCancel = allowedStatus === "canceled";

                          return (
                            <button
                              key={allowedStatus}
                              onClick={() => {
                                setStatus(allowedStatus as OrderStatus);
                              }}
                              className={`p-4 rounded-lg transition-all font-semibold flex items-center gap-3 ${
                                isSelected
                                  ? isCancel
                                    ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                                    : "bg-[#1fb854] text-white shadow-lg shadow-[#1fb854]/50"
                                  : isCancel
                                    ? "bg-red-900 text-red-200 hover:bg-red-800 hover:text-red-100"
                                    : "bg-[#1fb854]/30 text-[#30ce67] hover:bg-[#1fb854]/50 hover:text-white"
                              }`}
                            >
                              <i
                                className={`fa-solid ${
                                  allowedStatus === "completed"
                                    ? "fa-check-circle"
                                    : allowedStatus === "processing"
                                      ? "fa-cog"
                                      : allowedStatus === "received"
                                        ? "fa-inbox"
                                        : allowedStatus === "re-processing"
                                          ? "fa-arrow-rotate-left"
                                          : "fa-ban"
                                }`}
                              ></i>
                              {statusLabel}
                            </button>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="p-4 bg-[#1fb854]/20 text-[#1fb854] rounded-lg flex items-center gap-2">
                      <i className="fa-solid fa-check-circle"></i>
                      <span>
                        Order workflow is complete. No further actions needed.
                      </span>
                    </div>
                  )}
                </div>

                {/* Update Button */}
                {getAllowedNextStatuses(order.status).length > 0 &&
                  status !== order.status && (
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="mt-6 btn btn-primary btn-lg w-full md:w-auto"
                    >
                      {updating ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Updating Status...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check"></i> Confirm Update
                          to{" "}
                          {
                            ORDER_STATUSES.find((s) => s.value === status)
                              ?.label
                          }
                        </>
                      )}
                    </button>
                  )}
              </div>
            )}

            {/* Assign Work */}
            {order.status === "pending" && (
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md no-print">
                <h3 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-user-check"></i>
                  Assign Work to Employee
                </h3>
                <p className="text-[#30ce67] text-sm mb-4">
                  {order.assignedEmployeeId
                    ? "Currently assigned to: "
                    : "This order is not assigned yet. "}
                  {order.assignedEmployeeId && (
                    <span className="font-semibold text-white">
                      {employees.find((e) => e.id === order.assignedEmployeeId)
                        ?.fullName || "Unknown Employee"}
                    </span>
                  )}
                </p>
                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="label text-[#30ce67] text-sm font-semibold">
                      <span className="label-text text-[#30ce67]">
                        Select Employee
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full bg-[#1b1717] text-[#30ce67] border-[#1fb854] focus:border-[#54c07a]"
                      value={assignedEmployeeId}
                      onChange={(e) => setAssignedEmployeeId(e.target.value)}
                    >
                      <option value="">-- Choose an employee --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.fullName}{" "}
                          {emp.specialization ? `(${emp.specialization})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAssignWork}
                    disabled={assigning || !assignedEmployeeId}
                    className="btn btn-success w-full md:w-auto"
                  >
                    {assigning ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-arrow-right"></i> Assign Work
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
