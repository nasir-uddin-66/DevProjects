import express from "express";
import { getDB } from "../config/database.js";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  sendCompletionEmail,
  sendCancellationEmail,
  sendStatusUpdateEmail,
} from "../utils/emailService.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Status transition rules - only allows forward movement
const STATUS_TRANSITIONS = {
  pending: ["processing", "canceled"],
  processing: ["completed", "canceled"],
  completed: ["received", "canceled"],
  received: ["re-processing"],
  "re-processing": ["completed", "canceled"],
};

// Validate if status transition is allowed
const isValidStatusTransition = (currentStatus, newStatus) => {
  const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus] || [];
  return allowedNextStatuses.includes(newStatus);
};

// Get all orders (filtered by role)
router.get("/", authenticate, async (req, res, next) => {
  try {
    const db = getDB();
    const { status } = req.query;
    let query = {};

    // Filter by role
    if (req.user.role === "user") {
      query.userId = req.user._id.toString();
    } else if (req.user.role === "employee") {
      query.assignedEmployeeId = req.user._id.toString();
    }
    // Admin sees all orders

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check permissions
    if (req.user.role === "user" && order.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (
      req.user.role === "employee" &&
      order.assignedEmployeeId !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Create order (User only)
router.post("/", authenticate, authorize("user"), async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      dressType,
      measurements,
      deliveryDate,
      urgency,
      deliveryMethod,
      deliveryAddress,
      additionalNotes,
      referenceImage,
      totalAmount,
      paidAmount,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress ||
      !dressType ||
      !measurements ||
      !deliveryDate ||
      !urgency ||
      !deliveryMethod ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const db = getDB();

    const order = {
      userId: req.user._id.toString(),
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      dressType,
      measurements,
      deliveryDate: new Date(deliveryDate),
      urgency,
      deliveryMethod,
      deliveryAddress:
        deliveryMethod === "home_delivery" ? deliveryAddress : null,
      additionalNotes: additionalNotes || null,
      referenceImage: referenceImage || null,
      status: "pending",
      paymentStatus:
        paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "due",
      totalAmount: parseFloat(totalAmount),
      paidAmount: parseFloat(paidAmount || 0),
      assignedEmployeeId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);
    order._id = result.insertedId;

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
});

// Update order
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const db = getDB();

    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check permissions
    if (req.user.role === "user" && order.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (
      req.user.role === "employee" &&
      order.assignedEmployeeId !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Prepare update data
    const allowedUpdates = [
      "status",
      "paymentStatus",
      "totalAmount",
      "paidAmount",
      "assignedEmployeeId",
      "deliveryDate",
      "additionalNotes",
    ];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (field === "deliveryDate") {
          updates[field] = new Date(updateData[field]);
        } else {
          updates[field] = updateData[field];
        }
      }
    });

    // Validate status transition if status is being updated
    if (updates.status && updates.status !== order.status) {
      if (!isValidStatusTransition(order.status, updates.status)) {
        return res.status(400).json({
          error: `Cannot transition from '${order.status}' to '${updates.status}'. Invalid status transition.`,
        });
      }
    }

    // Update payment status based on amounts (unless status is canceled)
    if (updates.status === "canceled") {
      // When order is canceled, set payment status to refunded
      updates.paymentStatus = "refunded";
    } else if (
      updates.paidAmount !== undefined ||
      updates.totalAmount !== undefined
    ) {
      const paidAmount =
        updates.paidAmount !== undefined
          ? updates.paidAmount
          : order.paidAmount;
      const totalAmount =
        updates.totalAmount !== undefined
          ? updates.totalAmount
          : order.totalAmount;

      if (paidAmount >= totalAmount) {
        updates.paymentStatus = "paid";
      } else if (paidAmount > 0) {
        updates.paymentStatus = "partial";
      } else {
        updates.paymentStatus = "due";
      }
    }

    updates.updatedAt = new Date();

    const result = await db
      .collection("orders")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" },
      );

    const updatedOrder = result.value || { ...order, ...updates };

    // Send status update email for any status change
    if (updates.status && updates.status !== order.status) {
      await sendStatusUpdateEmail(updatedOrder, updates.status, order.status);
    }

    // Send completion email if status changed to "completed"
    if (updates.status === "completed" && order.status !== "completed") {
      await sendCompletionEmail(updatedOrder);
    }

    // Send cancellation email if status changed to "canceled"
    if (updates.status === "canceled" && order.status !== "canceled") {
      await sendCancellationEmail(updatedOrder);
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

// Delete order (Admin only)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const db = getDB();

      const result = await db
        .collection("orders")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
