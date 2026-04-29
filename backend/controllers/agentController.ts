import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Agent } from "../models/Agent";
import { User } from "../models/User";
import { Task } from "../models/Task";
import { redistributeAllTasks } from "../services/taskRedistribution.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";

// add agent
export const addAgent = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, mobile, password } = req.body;

  const emailExists =
    (await Agent.findOne({ email })) ||
    (await User.findOne({ email }));

  if (emailExists) {
    throw new AppError("Email already exists", 400);
  }

  const mobileExists = await Agent.findOne({ mobile });

  if (mobileExists) {
    throw new AppError("Mobile already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    mobile,
    password: hashedPassword,
    role: "agent",
  });

  const agent = await Agent.create({
    name,
    email,
    mobile,
    password: hashedPassword,
  });

  // 🔥 REDISTRIBUTE ALL TASKS
  await redistributeAllTasks();

  res.status(201).json({
    message: "Agent created successfully",
    agent,
  });
});

// get agents
export const getAgents = asyncHandler(async (_req: Request, res: Response) => {
  const agents = await Agent.find({ isActive: true })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(agents);
});

// get all tasks (admin)
  export const getTasks = asyncHandler(async (_req: Request, res: Response) => {
    const tasks = await Task.find()
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  });

// get logged-in agent profile
export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = req.user;

    if (!currentUser) {
      throw new AppError("Not authorized", 401);
    }

    const agent = await Agent.findOne({
      email: currentUser.email,
    }).select("-password");

    if (!agent) {
      throw new AppError("Agent not found", 404);
    }

    res.status(200).json(agent);
  }
);

// deactivate agent + redistribute tasks + DELETE
export const deactivateAgent = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid agent id", 400);
    }

    const agent = await Agent.findById(id);

    if (!agent) {
      throw new AppError("Agent not found", 404);
    }

    // 🔥 DELETE AGENT FIRST
    await Agent.findByIdAndDelete(id);
    await User.findByIdAndDelete(id);

    // 🔥 REDISTRIBUTE ALL TASKS (NOT JUST ONE AGENT)
    await redistributeAllTasks();

    res.json({
      message: "Agent deleted and tasks redistributed",
    });
  }
);