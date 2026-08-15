// Stripe Payment Component

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { paymentService } from "../../api/services";

// Stripe publishable key - should be set via environment variable
// For production, get this from backend or environment config
const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51MockKeyForDevelopmentOnlyReplaceWithRealKey";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  orderId?: string; // Optional order ID for payment confirmation
}

const PaymentForm = ({
  amount,
  onSuccess,
  onError,
  orderId,
}: StripePaymentProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    // Create payment intent when component mounts
    if (amount > 0) {
      paymentService
        .createStripeIntent(amount, orderId)
        .then((data) => {
          console.log("Payment intent created:", data);
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Payment intent error:", error);
          onError(
            "Failed to initialize payment: " +
              (error?.message || "Unknown error"),
          );
        });
    }
  }, [amount, orderId]);

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Check for card errors before processing
    if (cardError) {
      onError(cardError);
      return;
    }

    setProcessing(true);

    try {
      if (!clientSecret) {
        onError("Payment not initialized. Please try again.");
        setProcessing(false);
        return;
      }

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onError("Card element not found");
        setProcessing(false);
        return;
      }

      // Confirm payment with Stripe using the newer method
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Customer", // You can get this from user context if needed
            },
          },
        });

      if (stripeError) {
        onError(stripeError.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded, confirming with backend...");
        // Confirm payment with backend
        try {
          await paymentService.confirmStripePayment(paymentIntent.id, orderId);
          console.log("Backend confirmation successful");
          onSuccess();
        } catch (error) {
          console.error("Backend confirmation error:", error);
          onError(
            "Payment confirmed but failed to update order: " +
              (error instanceof Error ? error.message : "Unknown error"),
          );
        }
      } else {
        onError("Payment not completed. Status: " + paymentIntent.status);
      }
    } catch (error) {
      onError("An error occurred during payment processing.");
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#30ce67",
        "::placeholder": {
          color: "#1fb854",
        },
        backgroundColor: "#1b1717",
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-[#1b1717] p-4 rounded-lg border border-[#1fb854]">
        <label className="label text-[#30ce67] mb-2">
          <span className="label-text">Card Details</span>
        </label>
        <CardElement options={cardElementOptions} onChange={handleCardChange} />
        {cardError && <p className="text-red-500 text-sm mt-2">{cardError}</p>}
      </div>

      <div className="bg-[#282424] p-4 rounded-lg border border-[#1fb854]">
        <p className="text-[#30ce67] text-sm mb-2">Amount to Pay:</p>
        <p className="text-[#1fb854] text-2xl font-bold">৳{amount}</p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? (
          <>
            <span className="loading loading-spinner"></span>
            Processing...
          </>
        ) : (
          <>
            <i className="fa-solid fa-credit-card"></i> Pay ৳{amount}
          </>
        )}
      </button>
    </form>
  );
};

export default function StripePayment({
  amount,
  onSuccess,
  onError,
  orderId,
}: StripePaymentProps) {
  const options: StripeElementsOptions = {
    mode: "payment",
    amount: amount * 100, // Convert to cents/paisa
    currency: "bdt",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        orderId={orderId}
      />
    </Elements>
  );
}
