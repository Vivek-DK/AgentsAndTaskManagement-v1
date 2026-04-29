export type UserRole = "admin" | "agent";

export type User = {
  _id: string;

  email: string;
  password: string;

  role: UserRole;
  mobile: string;

  isSuperAdmin: boolean;

  createdAt: string;
  updatedAt: string;
};