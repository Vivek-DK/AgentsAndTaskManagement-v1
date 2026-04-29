import mongoose, { Document, Schema, Types } from "mongoose";
import { IAgent } from "./Agent";

// ✅ Interface
export interface ITask extends Document {
  FirstName: string;
  Phone: string;
  Notes?: string;

  // 🔥 Important: supports both cases
  agent: Types.ObjectId | IAgent;

  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schema
const taskSchema = new Schema<ITask>(
  {
    FirstName: {
      type: String,
      required: true,
    },
    Phone: {
      type: String,
      required: true,
    },
    Notes: {
      type: String,
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Model
export const Task = mongoose.model<ITask>("Task", taskSchema);