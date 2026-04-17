import { Router } from "express";
import * as controller from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", controller.signup);
authRouter.post("/login", controller.login);
authRouter.post("/refresh", controller.refresh);
authRouter.post("/logout", controller.logout);

export default authRouter;
