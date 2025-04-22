import { Request, Response } from "express";
import {
  encryptPassword,
  findUserById,
  verifyPassword,
} from "../services/authServices";
import {
  updateUserPassword,
  updateUserProfileImage,
} from "../services/userServices";
import { uploadBufferToCloudinary } from "../services/cloudinaryService";

export const verifyUser = async (req: Request, res: Response) => {
  const userId = req.user?.id as number;

  const user = await findUserById(userId);

  if (user) {
    res.status(200).json({
      status: "success",
      message: "User Authenticated",
      user: req.user,
      profileImage: user.profileImage,
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmNew } = req.body;
  const userId = req.user?.id;
  try {
    if (userId) {
      const user = await findUserById(userId);
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      const validate = await verifyPassword(currentPassword, user.password);

      if (validate) {
        if (newPassword !== confirmNew) {
          res.status(400).json({
            status: "error",
            message: "New password and confirm password must be same.",
          });
          return;
        }
        const newHashPassword = await encryptPassword(newPassword);
        const response = await updateUserPassword(userId, newHashPassword);
        if (response) {
          res.status(200).json({
            status: "success",
            message: "Password updated succesfully",
          });
        } else {
          res
            .status(400)
            .json({ status: "error", message: "Update Password failed" });
        }
      } else {
        res
          .status(400)
          .json({ status: "error", message: "Current password is incorrect" });
      }
    } else {
      res
        .status(403)
        .json({ status: "error", message: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const changeProfileImage = async (req: Request, res: Response) => {
  const userId = req.user?.id as number;
  const profileImage = req.file;

  try {
    if (!profileImage) {
      res.status(400).json({
        status: "error",
        message: "No image file uploaded.",
      });
      return;
    }

    const uploadResult = await uploadBufferToCloudinary(
      profileImage.buffer,
      "profile_pictures"
    );

    if (!uploadResult.secure_url) {
      res.status(500).json({
        status: "error",
        message: "Failed to upload image to Cloudinary.",
      });
      return;
    }

    const updatedUser = await updateUserProfileImage(
      userId,
      uploadResult.secure_url
    );

    res.status(200).json({
      status: "success",
      message: "Profile image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update profile image",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
