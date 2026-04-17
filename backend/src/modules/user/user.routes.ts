import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as controller from "./user.controller.js";

const userRouter = Router();

userRouter.get("/profile", authMiddleware, controller.getProfile);
userRouter.put("/update-profile", authMiddleware, controller.updateProfile);

export default userRouter;
