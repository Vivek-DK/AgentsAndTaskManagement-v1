import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { IUser } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

// create new admin
export const createAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, mobile } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      mobile,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  }
);

// delete admin
export const deleteAdminByCredentials = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const currentUser = req.user as IUser;

    if (!currentUser || currentUser.role !== "admin") {
      throw new AppError("Not authorized", 403);
    }

    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      throw new AppError("Admin not found", 404);
    }

    if (admin.isSuperAdmin) {
      throw new AppError("Super admin cannot be deleted", 400);
    }

    if (admin._id.toString() === currentUser._id.toString()) {
      throw new AppError("You cannot delete your own account", 400);
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      throw new AppError("Invalid password", 400);
    }

    await admin.deleteOne();

    res.json({
      message: "Admin deleted successfully",
    });
  }
);

// get admins
export const getAdmins = asyncHandler(
  async (_req: Request, res: Response) => {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(admins);
  }
);

// get my profile
export const getMyAdminProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = req.user as IUser;

    if (!currentUser) {
      throw new AppError("Not authorized", 401);
    }

    const admin = await User.findById(currentUser._id).select("-password");

    if (!admin || admin.role !== "admin") {
      throw new AppError("Admin not found", 404);
    }

    res.json(admin);
  }
);