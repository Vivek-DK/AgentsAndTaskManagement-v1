import mongoose from "mongoose";
import { env } from "./env";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error: any) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;