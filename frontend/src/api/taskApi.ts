import api from "./axios";
import { Task } from "../types/task";

// get tasks for logged-in agent
export const getMyTasks = async (): Promise<Task[]> => {
  return await api.get<Task[]>("/tasks/my-tasks");
};

// get all tasks (admin)
export const getAllTasks = async (): Promise<Task[]> => {
  return await api.get<Task[]>("/upload/tasks");
};

// delete single task
export const deleteTaskById = async (id: string) => {
  return await api.delete<{ message: string }>(`/tasks/${id}`);
};

// delete all tasks
export const deleteAllTasksApi = async () => {
  return await api.delete<{ message: string }>("/tasks");
};

// upload & distribute tasks
export const uploadTasks = async (
  formData: FormData,
  onProgress?: (percent: number) => void
) => {
  return await api.post<{ message: string }>("/upload", formData, {
    
    onUploadProgress: (event) => {
      if (!event.total) return;

      const percent = Math.round(
        (event.loaded * 100) / event.total
      );

      onProgress?.(percent);
    },
  });
};