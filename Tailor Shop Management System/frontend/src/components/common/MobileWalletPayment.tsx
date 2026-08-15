// Mobile Wallet Payment Component (bKash & Nagad)

import { useState } from "react";
import toast from "react-hot-toast";
import { paymentService } from "../../api/services";
import bkashLogo from "../../assets/icons/bkash-logo.png";
import nagadLogo from "../../assets/icons/nagad-logo.png";

interface MobileWalletPaymentProps {
  amount: number;
  paymentMethod: "bkash" | "nagad";
  onSuccess: () => void;
  onError: (error: string) => void;
  orderId?: string;
}

export default function MobileWalletPayment({
  amount,
  paymentMethod,
  onSuccess,
  onError,
  orderId,
}: MobileWalletPaymentProps) {
  const [transactionId, setTransactionId] = useState("");
  const [processing, setProcessing] = useState(false);

  const paymentMethodName = paymentMethod === "bkash" ? "bKash" : "Nagad";
  const logo = paymentMethod === "bkash" ? bkashLogo : nagadLogo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast.error("Please enter your Transaction ID");
      return;
    }

    setProcessing(true);

    try {
      const result = await paymentService.processMobileWallet(
        paymentMethod,
        amount,
        transactionId,
        orderId,
      );

      toast.success(
        result.message ||
          `Payment of ৳${amount} successful via ${paymentMethodName}!`,
      );
      setTransactionId("");
      onSuccess();
    } catch (error: any) {
      const errorMessage =
        error.message || "An error occurred during payment processing.";
      onError(errorMessage);
      toast.error(errorMessage);
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Header */}
      <div className="flex items-center justify-center gap-4 pb-6 border-b border-[#1fb854]">
        <img
          src={logo}
          alt={paymentMethodName}
          className="w-16 h-16 object-contain"
        />
        <div>
          <h3 className="text-[#54c07a] text-xl font-bold">
            {paymentMethodName}
          </h3>
          <p className="text-[#30ce67] text-sm">Mobile Wallet Payment</p>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-5 rounded-xl border-2 border-[#1fb854] shadow-md">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-[#1fb854] text-[#1b1717] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
            1
          </div>
          <div className="flex-1">
            <p className="text-[#54c07a] font-semibold text-sm">
              Open Your {paymentMethodName} App
            </p>
            <p className="text-[#30ce67] text-xs mt-1">
              Launch the {paymentMethodName} mobile application on your phone
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="bg-[#1fb854] text-[#1b1717] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
            2
          </div>
          <div className="flex-1">
            <p className="text-[#54c07a] font-semibold text-sm">
              Send Money to This Number
            </p>
            <div className="bg-[#1b1717] p-3 rounded-lg mt-2 border border-[#1fb854]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#30ce67] text-lg font-mono font-bold">
                  01700-000-001
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("01700000001");
                    toast.success("Phone number copied!");
                  }}
                  className="btn btn-xs btn-outline border-[#1fb854] text-[#1fb854] hover:bg-[#1fb854] hover:text-[#1b1717]"
                >
                  <i className="fa-solid fa-copy"></i>
                </button>
              </div>
              <p className="text-xs text-[#1fb854] mt-2">Amount: ৳{amount}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-[#1fb854] text-[#1b1717] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
            3
          </div>
          <div className="flex-1">
            <p className="text-[#54c07a] font-semibold text-sm">
              Get Your Transaction ID
            </p>
            <p className="text-[#30ce67] text-xs mt-1">
              After successful payment, {paymentMethodName} will provide a
              transaction ID. Copy it and paste below.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction ID Input */}
      <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-6 rounded-xl border border-[#1fb854]">
        <label className="label text-[#30ce67] mb-3">
          <span className="label-text text-[#30ce67] font-semibold">
            Transaction ID
          </span>
        </label>
        <input
          type="text"
          placeholder={`Enter your ${paymentMethodName} transaction ID`}
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="input input-bordered w-full bg-[#1b1717] border-[#1fb854] text-[#30ce67] placeholder:text-[#1fb854] placeholder:opacity-50 focus:border-[#54c07a] focus:outline-none text-lg"
          required
        />
        <p className="text-xs text-[#1fb854] mt-2 flex items-center gap-2">
          <i className="fa-solid fa-info-circle"></i>
          You can find this ID in your {paymentMethodName} app transaction
          history
        </p>
      </div>

      {/* Amount Section */}
      <div className="bg-linear-to-br from-[#282424] to-[#1b1717] p-5 rounded-lg border-2 border-[#1fb854] shadow-md">
        <p className="text-[#30ce67] text-xs font-semibold uppercase mb-2">
          Amount to Pay
        </p>
        <p className="text-[#54c07a] text-3xl font-bold">৳{amount}</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing}
        className="btn btn-primary w-full bg-[#1fb854] hover:bg-[#178a3f] border-[#1fb854] text-white font-semibold py-3 rounded-lg transition-all duration-200"
      >
        {processing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing Payment...
          </>
        ) : (
          <>
            <i className="fa-solid fa-mobile-screen-button"></i>
            Pay ৳{amount} via {paymentMethodName}
          </>
        )}
      </button>

      {/* Test Instructions */}
      <div className="bg-[#282424] p-4 rounded-lg border border-[#1fb854] border-dashed">
        <p className="text-xs text-[#30ce67] mb-1 font-semibold">
          🧪 Demo Mode
        </p>
        <p className="text-xs text-[#1fb854] opacity-75">
          For testing, you can enter any transaction ID (e.g., TXN123456789)
        </p>
      </div>
    </form>
  );
}
