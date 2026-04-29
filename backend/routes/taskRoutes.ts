import { Router } from "express";
import {
  getMyTasks,
  getTasksByAgentId,
  deleteTask,
  deleteAllTasks,
} from "../controllers/taskController";

import { protect } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";

const router = Router();

router.get("/my-tasks", protect, authorize("agent"), getMyTasks);

router.get(
  "/agent/:agentId",
  protect,
  authorize("admin"),
  getTasksByAgentId
);

router.delete(
  "/:id", 
  protect, 
  authorize("admin"), 
  deleteTask
);

router.delete(
  "/", 
  protect, 
  authorize("admin"), 
  deleteAllTasks
);

export default router;