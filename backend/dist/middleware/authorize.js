"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// middleware to allow access based on user roles
const authorize = (...roles) => {
    return (req, res, next) => {
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
exports.default = authorize;
