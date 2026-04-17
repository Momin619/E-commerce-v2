import { Request } from "express";

export type Role = "seller" | "customer";

export interface JwtUser {
  id: string;
  role: Role;
}

export interface AuthRequest extends Request {
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
  user?: JwtUser;
}

export interface SignupDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}
