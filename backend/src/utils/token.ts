import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JwtUser } from "../modules/auth/auth.types.js";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

// Generate Access Token
export const generateAccessToken = (user: JwtUser) => {
  return jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
};

// Generate Refresh Token
export const generateRefreshToken = (user: JwtUser) => {
  return jwt.sign({ id: user.id, role: user.role }, REFRESH_TOKEN_SECRET, {
    expiresIn: "2m",
  });
};

// Verify Access Token
export const verifyAccessToken = (token: string): JwtUser => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtUser;
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): JwtUser => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtUser;
};
