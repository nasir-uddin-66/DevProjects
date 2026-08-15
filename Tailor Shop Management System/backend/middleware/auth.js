import jwt from "jsonwebtoken";
import { getDB } from "../config/database.js";
import { ObjectId } from "mongodb";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDB();

    // Convert string userId to ObjectId for database query
    let objectId;
    try {
      objectId = new ObjectId(decoded.userId);
    } catch (e) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Check if user exists
    let user = await db.collection("users").findOne({ _id: objectId });

    if (!user) {
      // Check employees collection
      user = await db.collection("employees").findOne({ _id: objectId });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Remove password from user object
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: "Authentication error" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
