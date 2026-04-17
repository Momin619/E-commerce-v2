import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.js";
import { AuthRequest } from "../modules/auth/auth.types.js";
import { IJwtUser } from "../modules/user/user.types.js";
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyAccessToken(token) as IJwtUser;

    req.user = decoded; // ✅ now typed correctly

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
