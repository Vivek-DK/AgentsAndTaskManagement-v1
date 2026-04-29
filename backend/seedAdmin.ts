import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/User";

dotenv.config();

if (process.env.NODE_ENV === "production") {
  console.log("Seeding disabled in production");
  process.exit();
}

const seedAdmin = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    const normalizedEmail = ADMIN_EMAIL.toLowerCase();

    // 🔥 check by super admin flag (better than email only)
    const existingAdmin = await User.findOne({
      email: normalizedEmail,
      isSuperAdmin: true,
    });

    if (existingAdmin) {
      console.log("Super Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      mobile: "7348862962",
      isSuperAdmin: true,
    });

    console.log("Super Admin created successfully");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedAdmin();