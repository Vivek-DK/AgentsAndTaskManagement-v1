import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware";
import { protect } from "../middleware/authMiddleware";
import authorize from "../middleware/authorize";
import { uploadAndDistribute } from "../controllers/uploadController";
import { getTasks } from "../controllers/agentController";

const router = Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("file"),
  uploadAndDistribute
);

router.get("/tasks", protect, authorize("admin"), getTasks);

export default router;