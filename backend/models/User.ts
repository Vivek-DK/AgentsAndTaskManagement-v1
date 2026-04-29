import mongoose, { Document, Schema } from "mongoose";

// ✅ Role type (reuse later in middleware, controllers, frontend)
export type UserRole = "admin" | "agent";

// ✅ Base interface (represents a User document)
export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  mobile: string;
  isSuperAdmin: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "agent"],
      default: "agent",
    },
    mobile: {
      type: String,
      required: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model<IUser>("User", userSchema);