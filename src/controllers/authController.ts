import { Request, Response } from "express";

import {
  createNewUser,
  encryptPassword,
  findUserByEmail,
  generateAccessToken,
  verifyPassword,
} from "../services/authServices";

import { User, UserReq } from "../types/type";
import { stat } from "fs";

export const register = async (req: Request, res: Response) => {
  const { userName, email, password }: User = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    // If the user already exists
    if (existingUser) {
      res
        .status(400)
        .json({ status: "error", message: "Email is already registered." });
    } else {
      // Hash the password
      // const hashPassword = await bcrypt.hash(password, 10);
      const hashPassword = await encryptPassword(password);

      // Create a new user by calling the createNewUser function
      const user = await createNewUser({
        userName,
        email,
        password: hashPassword,
      });

      res.status(201).json({
        status: "success",
        message: "User Registered Successfully.",
        user: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred." });
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
      };
      // const passwordMatch = await bcrypt.compare(password, user.password);
      const passwordMatch = await verifyPassword(password, user.password);

      if (passwordMatch) {
        const accessToken = await generateAccessToken(
          logUser.id,
          logUser.email,
          logUser.userName
        );

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/", // Available to all paths on the domain
          maxAge: 3600000,
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
