import express from "express";
import Stripe from "stripe";
import { getDB } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { sendOrderPlacedEmail } from "../utils/emailService.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// Create Stripe payment intent
router.post("/stripe/create-intent", authenticate, async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/paisa
      currency: "bdt",
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId || "new_order",
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
});

// Confirm Stripe payment
router.post("/stripe/confirm", authenticate, async (req, res, next) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment intent ID is required" });
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Update order payment status if orderId provided
    if (orderId) {
      const db = getDB();
      const order = await db
        .collection("orders")
        .findOne({ _id: new ObjectId(orderId) });

      if (order) {
        const paidAmount = order.paidAmount + paymentIntent.amount / 100;
        const paymentStatus =
          paidAmount >= order.totalAmount ? "paid" : "partial";

        const updatedOrderResult = await db
          .collection("orders")
          .findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            {
              $set: {
                paidAmount: paidAmount,
                paymentStatus: paymentStatus,
                updatedAt: new Date(),
              },
            },
            { returnDocument: "after" },
          );

        const updatedOrder = updatedOrderResult.value || {
          ...order,
          paidAmount,
          paymentStatus,
        };

        // Send order placed email only if payment is completed
        if (paymentStatus === "paid" && order.paymentStatus !== "paid") {
          await sendOrderPlacedEmail(updatedOrder);
        }
      }
    }

    res.json({
      message: "Payment confirmed",
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Process mobile wallet payment (bKash/Nagad)
router.post("/mobile-wallet", authenticate, async (req, res, next) => {
  try {
    const { paymentMethod, amount, orderId, transactionId } = req.body;

    if (!paymentMethod || !amount || !transactionId) {
      return res.status(400).json({
        error: "Payment method, amount, and Transaction ID are required",
      });
    }

    // Validate payment method
    if (!["bkash", "nagad"].includes(paymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // In a real implementation, you would integrate with bKash/Nagad APIs here
    // For now, we'll simulate a successful payment

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update order payment status if orderId provided
    if (orderId) {
      const db = getDB();
      const order = await db
        .collection("orders")
        .findOne({ _id: new ObjectId(orderId) });

      if (order) {
        const paidAmount = order.paidAmount + parseFloat(amount);
        const paymentStatus =
          paidAmount >= order.totalAmount ? "paid" : "partial";

        const updatedOrderResult = await db
          .collection("orders")
          .findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            {
              $set: {
                paidAmount: paidAmount,
                paymentStatus: paymentStatus,
                updatedAt: new Date(),
              },
            },
            { returnDocument: "after" },
          );

        const updatedOrder = updatedOrderResult.value || {
          ...order,
          paidAmount,
          paymentStatus,
        };

        // Send order placed email only if payment is completed
        if (paymentStatus === "paid" && order.paymentStatus !== "paid") {
          await sendOrderPlacedEmail(updatedOrder);
        }
      }
    }

    res.json({
      message: `Payment of ৳${amount} successful via ${paymentMethod.toUpperCase()}`,
      transactionId: transactionId,
      amount: parseFloat(amount),
      paymentMethod,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
