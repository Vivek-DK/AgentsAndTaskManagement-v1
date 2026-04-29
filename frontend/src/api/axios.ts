import axios from "axios";
import { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "https://agentsandtaskmanagement-v1.onrender.com/api",
});

// ---------------- REQUEST ----------------

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

// ---------------- RESPONSE ----------------

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject(message);
  }
);

export type Api = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

export default api as unknown as Api;