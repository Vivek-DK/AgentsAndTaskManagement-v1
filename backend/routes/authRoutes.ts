import { Router } from "express";
import { loginUser } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/login", 
  validate(loginSchema), 
  loginUser
);

export default router;