import express from "express";
import cookieParser from "cookie-parser";

// Routes
import userRouter from "./modules/user/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

// Feature routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

export default app;
