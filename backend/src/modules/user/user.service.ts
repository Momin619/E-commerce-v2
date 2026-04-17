import { User } from "./user.model.js";

export const getProfileService = async (id: string) => {
  return await User.findById(id).select("-password");
};

export const updateProfileService = async (id: string, data: any) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};
