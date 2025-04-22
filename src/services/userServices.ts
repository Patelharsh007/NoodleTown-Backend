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

  if (user.profileImage) {
    try {
      const oldPublicId = extractPublicIdFromUrl(user.profileImage);
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }
    } catch (error) {
      console.error("Error deleting old profile image:", error);
    }
  }
  user.profileImage = newProfileImageUrl;
  await userRepository.save(user);
  return user;
};
