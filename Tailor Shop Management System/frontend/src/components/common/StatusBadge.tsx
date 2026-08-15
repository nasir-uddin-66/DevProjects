// StatusBadge component for displaying order/payment status

import type { OrderStatus, PaymentStatus } from "../../types";

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus;
  type?: "order" | "payment";
}

export default function StatusBadge({
  status,
  type = "order",
}: StatusBadgeProps) {
  const getStatusColor = () => {
    if (type === "payment") {
      switch (status as PaymentStatus) {
        case "paid":
          return "badge-success";
        case "due":
          return "badge-error";
        case "partial":
          return "badge-warning";
        case "refunded":
          return "badge-info";
        default:
          return "badge-neutral";
      }
    } else {
      switch (status as OrderStatus) {
        case "pending":
          return "badge-warning";
        case "processing":
          return "badge-info";
        case "completed":
          return "badge-success";
        case "canceled":
          return "badge-error";
        case "received":
          return "badge-neutral";
        case "re-processing":
          return "badge-warning";
        default:
          return "badge-neutral";
      }
    }
  };

  const getStatusLabel = () => {
    if (status === "re-processing") {
      return "Re-Processing";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`badge ${getStatusColor()} text-xs`}>
      {getStatusLabel()}
    </span>
  );
}
