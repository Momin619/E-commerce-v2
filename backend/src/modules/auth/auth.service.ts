import bcrypt from "bcryptjs";
import { User } from "../user/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.js";
import { LoginDTO, SignupDTO, LoginResponse } from "./auth.types.js";
import { log } from "node:console";

export const signupService = async (data: SignupDTO) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await User.create({ ...data, password: hashed });

  const { password, ...safeUser } = user.toObject();

  return safeUser;
};

export const loginService = async (data: LoginDTO): Promise<LoginResponse> => {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) throw new Error("User doesn't exist");

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const payload = {
    id: user._id.toString(),
    role: user.role,
  };

  const { password, ...safeUser } = user.toObject();
  let accessToken = generateAccessToken(payload);
  let refreshToken = generateRefreshToken(payload);
  console.log("Generating token on login request");
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  console.log("Generated tokens on login");
  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const refreshService = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  const accessToken = generateAccessToken({
    id: decoded.id,
    role: decoded.role, // ✅ no DB call needed
  });
  console.log("Generated new access token : ", accessToken);
  return accessToken;
};

export const meService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");

  return user;
};
