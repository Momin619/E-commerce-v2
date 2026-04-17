import { Response } from "express";
import * as service from "./user.service.js";

export const getProfile = async (req: any, res: Response) => {
  const user = await service.getProfileService(req.user.id);
  res.json(user);
};

export const updateProfile = async (req: any, res: Response) => {
  const user = await service.updateProfileService(req.user.id, req.body);
  res.json(user);
};
