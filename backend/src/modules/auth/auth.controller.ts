import { Request, Response } from "express";
import * as service from "./auth.service.js";

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  const user = await service.signupService(req.body);
  res.json(user);
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await service.loginService(
    email,
    password,
  );

  // ACCESS TOKEN COOKIE
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  // REFRESH TOKEN COOKIE
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ user });
};

// REFRESH TOKEN
export const refresh = (req: any, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    const newAccessToken = service.refreshService(token);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ message: "Access token refreshed" });
  } catch {
    return res.status(401).json({
      message: "Session expired. Please login again.",
    });
  }
};

// LOGOUT
export const logout = (req: any, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
  });

  res.json({ message: "Logged out successfully" });
};
