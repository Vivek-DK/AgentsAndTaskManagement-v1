import mongoose, { Document, Schema } from "mongoose";

// ✅ Interface for Agent document
export interface IAgent extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schema
const agentSchema = new Schema<IAgent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Model
export const Agent = mongoose.model<IAgent>("Agent", agentSchema);