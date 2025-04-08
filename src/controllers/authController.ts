import { Request, Response } from "express";
import * as fs from "fs";

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

  // console.log("register - req.body:", req.body);
  // console.log("register - req.file:", profileImage);

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        status: "error",
        message: "Email is already registered.",
      });
    }

    // Upload profile image to Cloudinary
    let profileImageUrl: string | undefined;
    if (profileImage) {
      const uploadResult = await uploadBufferToCloudinary(
        profileImage.buffer,
        "profile_pictures"
      );
      profileImageUrl = uploadResult.secure_url;
    }

    // Hash the password
    const hashPassword = await encryptPassword(password);

    // Create a new user
    // console.log("profile url", profileImageUrl);
    const user = await createNewUser({
      userName,
      email,
      password: hashPassword,
      profileImage: profileImageUrl,
    });

    res.status(201).json({
      status: "success",
      message: "User Registered Successfully.",
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
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
    //find user with email
    const user = await findUserByEmail(email);

    if (user) {
      const logUser = {
        id: user.id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      };
      // const passwordMatch = await bcrypt.compare(password, user.password);
      const passwordMatch = await verifyPassword(password, user.password);

      if (passwordMatch) {
        const accessToken = await generateAccessToken(
          logUser.id,
          logUser.email,
          logUser.userName,
          logUser.profileImage
        );

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/", // Available to all paths on the domain
          maxAge: 24 * 60 * 60 * 1000, //hr*60*60*1000
        });

        res.status(201).json({
          status: "success",
          message: "User Logged-In Successfully.",
          logUser,
          accessToken,
        });
      } else {
        res
          .status(401)
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
      // Clear the access_token cookie
      res.clearCookie("access_token", {
        httpOnly: true, // Make sure the cookie is not accessible from JavaScript (XSS protection)
        secure: false,
        sameSite: "lax", // Prevent CSRF attacks
        path: "/", // Ensure the correct path is cleared
      });

      // Respond with a success message
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
