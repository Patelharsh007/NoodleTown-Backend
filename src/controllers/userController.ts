import { Request, Response } from "express";
import {
  encryptPassword,
  findUserById,
  verifyPassword,
} from "../services/authServices";
import { updateUserPassword } from "../services/userServices";

export const verifyUser = async (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "success", message: "User Authenticated", user: req.user });
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
