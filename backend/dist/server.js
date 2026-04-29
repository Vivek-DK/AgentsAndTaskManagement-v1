"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env_1 = require("./config/env");
const db_1 = __importDefault(require("./config/db"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
// security
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "https://agents-and-task-management.vercel.app",
        "http://localhost:5173",
    ],
    credentials: true,
}));
// rate limit
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
// logging
if (env_1.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("combined"));
}
// body
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// health
app.get("/", (_req, res) => {
    res.json({
        status: "API Running",
        environment: env_1.env.NODE_ENV,
    });
});
// routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/agents", agentRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// 404
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// error handler
app.use((err, _req, res, _next) => {
    if (env_1.env.NODE_ENV === "development") {
        console.error(err);
    }
    res.status(err.statusCode || 500).json({
        message: err.message || "Server Error",
    });
});
// start server properly
const startServer = async () => {
    try {
        await (0, db_1.default)();
        app.listen(env_1.env.PORT, () => {
            console.log(`Server running on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Startup error:", error);
        process.exit(1);
    }
};
startServer();
