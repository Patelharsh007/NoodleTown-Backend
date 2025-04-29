import { userRepository } from "../repositories/dataRepositories";

import {
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
} from "./cloudinaryService";

export const usersAllList = async () => {
  const users = await userRepository.find();
  console.log(users);
  return users;
};

export const updateUserPassword = async (
  userId: number,
  newPassword: string
) => {
  return await userRepository.update(userId, { password: newPassword });
};

export const updateUserProfileImage = async (
  userId: number,
  newProfileImageUrl: string
) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.profile_image) {
    try {
      const oldPublicId = extractPublicIdFromUrl(user.profile_image);
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }
    } catch (error) {
      console.error("Error deleting old profile image:", error);
    }
  }
  user.profile_image = newProfileImageUrl;
  await userRepository.save(user);
  return user;
};
