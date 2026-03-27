const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mondoSanitize = require("express-mongo-sanitize")

// ================= LOAD ENV =================
dotenv.config();

// ================= IMPORTS =================
const connectDB = require("./config/db");

// routes
const authRoutes = require("./routes/authRoutes");
const agentRoutes = require("./routes/agentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ================= INIT APP =================
const app = express();

// ================= DATABASE =================
connectDB();

// ================= GLOBAL MIDDLEWARE =================

// enable CORS for frontend
app.use(cors({
  origin: ["https://agents-and-task-management.vercel.app", "http://localhost:5173"],
  credentials: true
}));

// body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    status: "API Running",
    environment: process.env.NODE_ENV || "development"
  });
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// ================= 404 HANDLER =================
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Server Error"
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
