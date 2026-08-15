import bcrypt from "bcryptjs";
import { connectDB, getDB } from "../config/database.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const createAdminUser = async () => {
  try {
    await connectDB();
    const db = getDB();

    // Check if admin already exists
    const existingAdmin = await db.collection("users").findOne({
      email: "admin@stitchcraft.com",
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@stitchcraft.com");
      console.log("Password: admin123");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = {
      email: "admin@stitchcraft.com",
      password: hashedPassword,
      fullName: "StitchCraft Admin",
      phone: "+1234567890",
      address: "Admin Office",
      role: "admin",
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(adminUser);

    console.log("Admin user created successfully!");
    console.log("\nLogin Credentials:");
    console.log("Email: admin@tailormanagement.com");
    console.log("Password: admin123");
    console.log("\nIMPORTANT: Change this password in production!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
