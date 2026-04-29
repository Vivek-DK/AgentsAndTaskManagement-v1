import { Agent } from "./agent";

export type Task = {
  _id: string;

  FirstName: string;
  Phone: string;
  Notes?: string;

  agent: string | Agent | null;

  createdAt: string;
  updatedAt: string;
};

