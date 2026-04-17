import bcrypt from "bcryptjs";
import { User } from "../user/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.js";

export const signupService = async (data: any) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(data.password, 10);

  return await User.create({ ...data, password: hashed });
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const payload = {
    id: user._id.toString(),
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { user, accessToken, refreshToken };
};

export const refreshService = (token: string) => {
  if (!token) throw new Error("No refresh token");

  try {
    const decoded = verifyRefreshToken(token);

    return generateAccessToken({
      id: decoded.id,
      role: "customer", // optional: better fetch from DB
    });
  } catch {
    throw new Error("Refresh expired");
  }
};
