import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User";

// middleware to allow access based on user roles
const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 🔥 safety check (TS + runtime)
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, user missing",
      });
    }

    // check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    next();
  };
};

export default authorize;