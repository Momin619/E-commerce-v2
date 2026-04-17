import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { IJwtUser } from "../modules/user/user.types.js";
import { verifyAccessToken } from "../utils/token.js";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  // 1. check if token exists
  if (!token) {
    return res.status(401).json({
      message: "No access token in cookies",
    });
  }

  try {
    // 2. verify token
    const decoded = verifyAccessToken(token);
    // 3. attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};
