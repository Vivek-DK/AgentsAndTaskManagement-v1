import axios from "axios";

// create axios instance with base API URL
const instance = axios.create({
  baseURL: "https://agentsandtaskmanagement.onrender.com/api",
});

// attach token automatically to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
