import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); 

import { env } from "./config/env";

import connectDB from "./config/db";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan"

import authRoutes from "./routes/authRoutes";
import agentRoutes from "./routes/agentRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import taskRoutes from "./routes/taskRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

// security
app.use(helmet());

app.use(
  cors({
    origin: [
      "https://agents-and-task-management.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);

// rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// logging
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// health
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "API Running",
    environment: env.NODE_ENV,
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// error handler
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (env.NODE_ENV === "development") {
      console.error(err);
    }

    res.status(err.statusCode || 500).json({
      message: err.message || "Server Error",
    });
  }
);

// start server properly
const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();