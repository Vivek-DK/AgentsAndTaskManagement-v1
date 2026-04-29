import { Router } from "express";
import {
  addAgent,
  getAgents,
  getTasks,
  getMyProfile,
  deactivateAgent,
} from "../controllers/agentController";

import { validate } from "../middleware/validate";
import { addAgentSchema } from "../validators/agent.validator";
import { protect } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";

const router = Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  validate(addAgentSchema),
  addAgent
);

router.get(
  "/", 
  protect, 
  authorize("admin"), 
  getAgents
);

router.get(
  "/tasks", 
  protect, 
  authorize("admin"), 
  getTasks
);

router.get(
  "/me", 
  protect, 
  getMyProfile
);

router.delete(
  "/:id", 
  protect, 
  authorize("admin"), 
  deactivateAgent
);

export default router;