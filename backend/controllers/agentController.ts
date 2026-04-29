import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Agent } from "../models/Agent";
import { User } from "../models/User";
import { Task } from "../models/Task";
import distributeTasks from "../services/distributionService";
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

// deactivate agent + redistribute tasks
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

    // deactivate
    agent.isActive = false;
    await agent.save();

    const tasks = await Task.find({ agent: id });

    if (tasks.length > 0) {
      const activeAgents = await Agent.find({
        isActive: true,
        _id: { $ne: new mongoose.Types.ObjectId(id) },
      });

      if (activeAgents.length) {
        const redistributed = distributeTasks(tasks, activeAgents);

        // 🔥 optimize: Promise.all instead of loop await
        await Promise.all(
          tasks.map((task, i) => {
            task.agent = redistributed[i].agent;
            return task.save();
          })
        );
      }
    }

    res.json({
      message: "Agent deactivated and tasks reassigned",
    });
  }
);