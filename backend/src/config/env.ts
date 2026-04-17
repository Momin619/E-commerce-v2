import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is missing in .env`);
  return value;
};

export const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: requireEnv("MONGODB_URI"),
  ACCESS_TOKEN_SECRET: requireEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: requireEnv("REFRESH_TOKEN_SECRET"),
};
