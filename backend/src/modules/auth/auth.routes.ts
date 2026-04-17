import { Router } from "express";
import * as controller from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const authRouter = Router();

// public
authRouter.post("/signup", controller.signup);
authRouter.post("/login", controller.login);
authRouter.post("/refresh", controller.refresh);

// protected
authRouter.get("/me", authMiddleware, controller.me);
authRouter.post("/logout", authMiddleware, controller.logout);

export default authRouter;
