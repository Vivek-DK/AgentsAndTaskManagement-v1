import api from "./axios";
import { Agent } from "../types/agent";
import { Task } from "../types/task";

export const createAgent = async (data: {
  name: string;
  email: string;
  mobile: string;
  password: string;
}) => {
  return await api.post<{ message: string }>("/agents", data);
};

export const getMyProfile = async (): Promise<Agent> => {
  return await api.get<Agent>("/agents/me");
};

export const getAgents = async (): Promise<Agent[]> => {
  return await api.get<Agent[]>("/agents");
};

export const getTasksByAgentId = async (
  id: string
): Promise<Task[]> => {
  return await api.get<Task[]>(`/tasks/agent/${id}`);
};

export const deactivateAgent = async (id: string) => {
  return await api.delete<{ message: string }>(`/agents/${id}`);
};