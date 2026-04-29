import { Task } from "../models/Task";
import { Agent } from "../models/Agent";
import { AppError } from "../utils/AppError";
import distributeTasks from "./distributionService";

export const redistributeAllTasks = async () => {
  const tasks = await Task.find({});
  const agents = await Agent.find({ isActive: true });

  if (!agents.length) {
    throw new AppError("No active agents available", 400);
  }

  if (!tasks.length) return;

  const cleanTasks = tasks.map((t) => ({
    FirstName: t.FirstName,
    Phone: t.Phone,
    Notes: t.Notes,
  }));

  const redistributed = distributeTasks(cleanTasks, agents);

  await Promise.all(
    tasks.map((task, i) => {
      task.agent = redistributed[i].agent;
      return task.save();
    })
  );
};