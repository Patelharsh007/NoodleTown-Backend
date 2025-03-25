import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/dataRepositories";

export const register = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userRepository.findOne({
      where: { email: email },
    });

    // If the user already exists
    if (existingUser) {
      res.status(400).json({ message: "Email is already registered." });
    } else {
      // Hash the password
      const hashPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = userRepository.create({
        userName,
        email,
        password: hashPassword,
      });

      // Save the new user to the database
      const user = await userRepository.save(newUser);

      res.status(201).json({
        message: "User Registered Successfully.",
        user: user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const login = async (req: Request, res: Response) => {
  res.send("Logg inn");
};
