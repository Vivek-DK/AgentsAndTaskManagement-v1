import api from "./axios";
import { User } from "../types/user";

export const createAdmin = async (data: {
  email: string;
  password: string;
  mobile: string;
}) => {
  return await api.post<{ message: string }>("/admin/create-admin", data);
};

export const deleteAdmin = async (data: {
  email: string;
  password: string;
}) => {
  return await api.post<{ message: string }>("/admin/delete", data);
};

export const getAdmins = async (): Promise<User[]> => {
  return await api.get<User[]>("/admin");
};

export const getMyAdmin = async (): Promise<User> => {
  return await api.get<User>("/admin/me");
};