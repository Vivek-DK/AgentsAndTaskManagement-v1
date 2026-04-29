import { Types } from "mongoose";
import { IAgent } from "../models/Agent";

type TaskInput = {
  FirstName: string;
  Phone: string;
  Notes?: string;
};

type DistributedTask = TaskInput & {
  agent: Types.ObjectId;
};

const distributeTasks = (
  tasks: TaskInput[],
  agents: IAgent[]
): DistributedTask[] => {
  if (!agents.length) return [];

  const totalTasks = tasks.length;
  const totalAgents = agents.length;

  const baseTasks = Math.floor(totalTasks / totalAgents);
  const remainingTasks = totalTasks % totalAgents;

  const result: DistributedTask[] = [];
  let taskIndex = 0;

  for (let i = 0; i < totalAgents; i++) {
    for (let j = 0; j < baseTasks; j++) {
      result.push({
        ...tasks[taskIndex],
        agent: agents[i]._id,
      });
      taskIndex++;
    }
  }

  for (let i = 0; i < remainingTasks; i++) {
    result.push({
      ...tasks[taskIndex],
      agent: agents[i]._id,
    });
    taskIndex++;
  }

  return result;
};

export default distributeTasks;