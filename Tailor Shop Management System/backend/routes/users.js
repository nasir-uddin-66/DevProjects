import express from "express";
import { getDB } from "../config/database.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all users (Admin only)
router.get("/", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const db = getDB();
    const users = await db
      .collection("users")
      .find({ role: "user" })
      .project({ password: 0 })
      .toArray();

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDB();

    // Users can only view their own profile, admins can view any
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, email } = req.body;
    const db = getDB();

    // Users can only update their own profile, admins can update any
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (email) updateData.email = email;
    updateData.updatedAt = new Date();

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after", projection: { password: 0 } }
      );

    // Handle both old and new MongoDB driver versions
    const updatedUser = result.value || result;

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Delete user (Admin only)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const db = getDB();

      const result = await db
        .collection("users")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
