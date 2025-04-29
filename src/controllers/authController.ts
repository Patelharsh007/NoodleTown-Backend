import { Request, Response } from "express";

import {
  createNewUser,
  encryptPassword,
  findUserByEmail,
  generateAccessToken,
  verifyPassword,
} from "../services/authServices";

import { uploadBufferToCloudinary } from "../services/cloudinaryService";
import { User } from "../types/type";

export const register = async (req: Request, res: Response) => {
  const { userName, email, password }: User = req.body;
  const profileImage = req.file;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        status: "error",
        message: "Email is already registered.",
      });
      return;
    }

    let profileImageUrl: string | undefined;
    if (profileImage) {
      const uploadResult = await uploadBufferToCloudinary(
        profileImage.buffer,
        "profile_pictures"
      );
      profileImageUrl = uploadResult.secure_url;
    }

    const hashPassword = await encryptPassword(password);

    const user = await createNewUser({
      userName,
      email,
      password: hashPassword,
      profile_image: profileImageUrl,
    });

    res.status(201).json({
      status: "success",
      message: "User Registered Successfully.",
      user: {
        id: user.id,
        userName: user.user_name,
        email: user.email,
        profileImage: user.profile_image,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (user) {
      const logUser = {
        id: user.id,
        userName: user.user_name,
        email: user.email,
        profileImage: user.profile_image,
      };

      const passwordMatch = await verifyPassword(password, user.password);

      if (passwordMatch) {
        const accessToken = await generateAccessToken(
          logUser.id,
          logUser.email,
          logUser.userName
        );

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
          status: "success",
          message: "User Logged-In Successfully.",
          logUser,
          accessToken,
          profileImage: logUser.profileImage,
        });
      } else {
        res
          .status(400)
          .json({ status: "success", message: "Incorrect password entered" });
      }
    } else {
      res.status(400).json({
        status: "error",
        message: "No registered user found with the entered email.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred." });
  }
};

export const logout = async (req: Request, res: Response) => {
  {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while logging out",
      });
    }
  }
};
