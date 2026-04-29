import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models/User";
import { Agent } from "../models/Agent";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

// generate token
const generateToken = (id: string, role: UserRole) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};

type LoginBody = {
  email: string;
  password: string;
  loginAs: UserRole;
};

export const loginUser = asyncHandler(
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password, loginAs } = req.body;

    // normalize email
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // 🔥 role validation
    if (loginAs !== user.role) {
      throw new AppError(
        loginAs === "admin"
          ? "Agents cannot login as admin"
          : "Admins cannot login as agent",
        403
      );
    }

    // 🔥 agent active check
    if (user.role === "agent") {
      const agent = await Agent.findOne({ email: user.email });

      if (!agent || !agent.isActive) {
        throw new AppError("Agent account is deactivated", 403);
      }
    }

    // 🔥 password check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // success
    res.json({
      message: "Login successful",
      token: generateToken(user._id.toString(), user.role),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
      },
    });
  }
);