import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { IJwtUser } from "../modules/user/user.types.js";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

// Generate Access Token
export const generateAccessToken = (user: IJwtUser) => {
  return jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

// Generate Refresh Token
export const generateRefreshToken = (user: IJwtUser) => {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Verify Access Token
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as IJwtUser;
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
};
