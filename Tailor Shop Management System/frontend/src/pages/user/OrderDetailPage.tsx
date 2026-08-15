// User OrderDetailPage - shows detailed order information

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import Layout from "../../components/common/Layout";
import UserSidebar from "../../components/user/UserSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { orderService } from "../../api/services";
import { printSection } from "../../utils/printHelpers";
import type { Order } from "../../types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  // Auto-refresh order data when payment status is "due" (waiting for confirmation)
  useEffect(() => {
    // Stop any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Only start refresh if order is loaded and payment is still due
    if (order && order.paymentStatus === "due") {
      refreshIntervalRef.current = setInterval(() => {
        if (id) {
          const fetchOrder = async () => {
            try {
              const orderData = await orderService.getOrderById(id);
              setOrder(orderData);
            } catch (error) {
              console.error("Error refreshing order:", error);
            }
          };
          fetchOrder();
        }
      }, 2000); // Refresh every 2 seconds
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [order?.paymentStatus, id]);

  const loadOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const orderData = await orderService.getOrderById(id);
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!id || !order) return;
    setCanceling(true);
    try {
      await orderService.updateOrder(id, {
        status: "canceled",
        paidAmount: 0,
        paymentStatus: "refunded",
      });
      toast.success("Order canceled and refunded successfully!");
      loadOrder();
      setCancelConfirm(false);
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error("Error canceling order:", error);
    } finally {
      setCanceling(false);
    }
  };

  const handleReprocessOrder = async () => {
    if (!id || !order) return;
    setReprocessing(true);
    try {
      await orderService.updateOrder(id, { status: "re-processing" });
      toast.success("Order sent to re-processing!");
      loadOrder();
      setReprocessConfirm(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send order for re-processing",
      );
      console.error("Error re-processing order:", error);
    } finally {
      setReprocessing(false);
    }
  };

  if (loading) {
    return (
      <Layout sidebar={<UserSidebar />}>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout sidebar={<UserSidebar />}>
        <div className="p-5">
          <p className="text-[#30ce67]">Order not found</p>
          <Link to="/user/orders" className="btn btn-primary mt-4">
            Back to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebar={<UserSidebar />} title="">
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
                to="/user/orders"
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
              {order.status === "pending" && (
                <button
                  onClick={() => setCancelConfirm(true)}
                  className="btn btn-error btn-sm text-white"
                >
                  <i className="fa-solid fa-times"></i> Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto py-8 px-5">
          <div id="print-section" className="space-y-6">
            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
                <h3 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-shirt"></i>
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
                  Status & Amount
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
                  <div className="border-b border-[#1fb854] pb-3">
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
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold mb-2">
                      Total Amount
                    </p>
                    <p className="text-[#54c07a] font-bold text-2xl">
                      ৳{order.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
              <h3 className="text-[#54c07a] font-bold text-lg mb-5 flex items-center gap-2">
                <i className="fa-solid fa-ruler"></i>
                Measurements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

            {/* Delivery Info */}
            <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border-2 border-[#1fb854] shadow-md hover:shadow-lg transition">
              <h3 className="text-[#54c07a] font-bold text-lg mb-5 flex items-center gap-2">
                <i className="fa-solid fa-truck"></i>
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="border-b border-[#1fb854] pb-3">
                  <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                    Delivery Method
                  </p>
                  <p className="text-white font-semibold text-lg capitalize mt-1">
                    {order.deliveryMethod.replace("_", " ")}
                  </p>
                </div>
                {order.deliveryAddress && (
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Delivery Address
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">
                      {order.deliveryAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>

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
                <i className="fa-solid fa-money-bill"></i>
                Transaction Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Total Amount
                    </p>
                    <p className="text-[#54c07a] font-bold text-2xl mt-1">
                      ৳{order.totalAmount}
                    </p>
                  </div>
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Paid Amount
                    </p>
                    <p className="text-green-400 font-bold text-2xl mt-1">
                      ৳{order.paidAmount}
                    </p>
                  </div>
                  <div>
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
                </div>
                <div className="space-y-4">
                  <div className="border-b border-[#1fb854] pb-3">
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
                  <div className="border-b border-[#1fb854] pb-3">
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Order Date
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#30ce67] text-xs opacity-75 uppercase font-semibold">
                      Last Updated
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Notice for Received Orders */}
      {order.status === "received" && (
        <div className="max-w-5xl mx-auto px-5 pb-8">
          <div className="bg-[#1fb854] text-white p-6 rounded-xl border-2 border-[#1fb854] shadow-md flex items-start gap-4">
            <i className="fa-solid fa-info-circle text-2xl shrink-0 mt-1"></i>
            <div>
              <h3 className="font-bold text-lg mb-2">Found Any Issues?</h3>
              <p className="text-white/90">
                If you found any issues with your order, please visit our shop
                with this order. Our team will review it and make the necessary
                adjustments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#282424] rounded-lg border-2 border-red-600 p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-red-600 text-3xl">
                <i className="fa-solid fa-exclamation-triangle"></i>
              </div>
              <h3 className="text-[#30ce67] text-xl font-bold">Cancel Order</h3>
            </div>
            <p className="text-[#30ce67] mb-6">
              Are you sure you want to cancel this order? You will be refunded
              the full amount paid.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirm(false)}
                disabled={canceling}
                className="btn btn-outline flex-1 text-[#30ce67] border-[#1fb854] hover:border-[#30ce67]"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={canceling}
                className="btn btn-error flex-1"
              >
                {canceling ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Canceling...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-times"></i> Cancel & Refund
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
