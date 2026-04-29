"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
dotenv_1.default.config();
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
        await mongoose_1.default.connect(MONGO_URI);
        console.log("MongoDB Connected");
        const normalizedEmail = ADMIN_EMAIL.toLowerCase();
        // 🔥 check by super admin flag (better than email only)
        const existingAdmin = await User_1.User.findOne({
            email: normalizedEmail,
            isSuperAdmin: true,
        });
        if (existingAdmin) {
            console.log("Super Admin already exists");
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(ADMIN_PASSWORD, 10);
        await User_1.User.create({
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
            mobile: "7348862962",
            isSuperAdmin: true,
        });
        console.log("Super Admin created successfully");
    }
    catch (error) {
        console.error("Seeding error:", error);
    }
    finally {
        await mongoose_1.default.connection.close();
        process.exit();
    }
};
seedAdmin();
