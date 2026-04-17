import { Request, Response } from "express";
import * as service from "./auth.service.js";
import { AuthRequest } from "./auth.types.js";
import { cookieOptions } from "../../config/cookies.js";

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  await service.signupService(req.body);

  res.json({
    message: "User created successfully",
  });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await service.loginService(
    req.body,
  );

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ user });
};

// REFRESH (NO middleware)
export const refresh = async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const accessToken = await service.refreshService(refreshToken);

    res.cookie("accessToken", accessToken, cookieOptions);

    return res.json({ message: "access token refreshed" });
  } catch {
    return res.status(401).json({ message: "Session expired" });
  }
};

// LOGOUT
export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie("accessToken", {
    ...cookieOptions,
    path: "/",
  });
  res.clearCookie("refreshToken", {
    ...cookieOptions,
    path: "/",
  });

  res.json({ message: "Logged out" });
};

// ME (USES middleware)
export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await service.meService(req.user.id);

  res.json({ user });
};
