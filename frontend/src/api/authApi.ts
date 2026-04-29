import api from "./axios";

type Role = "admin" | "agent";

type LoginPayload = {
  email: string;
  password: string;
  loginAs: Role;
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
    mobile: string;
  };
};

export const loginUser = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  return await api.post<LoginResponse>("/auth/login", data);
};