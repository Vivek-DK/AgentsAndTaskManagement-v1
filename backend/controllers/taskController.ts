import { Request, Response } from "express";
import mongoose from "mongoose";
import { Task } from "../models/Task";
import { Agent } from "../models/Agent";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

// get tasks for logged-in agent
export const getMyTasks = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;

  if (!currentUser) {
    throw new AppError("Not authorized", 401);
  }

  const agent = await Agent.findOne({
    email: currentUser.email,
  });

  if (!agent) {
    throw new AppError("Agent not found", 404);
  }

  const tasks = await Task.find({ agent: agent._id })
    .populate("agent", "name email mobile")
    .sort({ createdAt: -1 })
    .lean();

  res.json(tasks);
});

// get tasks by agent id (admin)
export const getTasksByAgentId = asyncHandler(
  async (req: Request, res: Response) => {
    const agentId = req.params.agentId as string;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      throw new AppError("Invalid agent id", 400);
    }

    const tasks = await Task.find({
      agent: new mongoose.Types.ObjectId(agentId),
    })
      .populate("agent", "name email mobile")
      .sort({ createdAt: -1 })
      .lean();

    res.json(tasks);
  }
);

// delete single task
export const deleteTask = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid task id", 400);
    }

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError("Task not found", 404);
    }

    res.json({
      message: "Task deleted successfully",
    });
  }
);

// delete all tasks
export const deleteAllTasks = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await Task.deleteMany({});

    res.json({
      message: "All tasks deleted",
      deletedCount: result.deletedCount,
    });
  }
);