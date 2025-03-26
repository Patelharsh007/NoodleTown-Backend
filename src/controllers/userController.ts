import { Request, Response } from "express";

import { usersAllList } from "../services/userServices";

export const verifyUser = async (req: Request, res: Response) => {
  res.status(200).json({ status: "success", user: req.user });
};

// export const getUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await usersAllList();

//     res.status(201).json({
//       message: "Users listed",
//       users,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "An unexpected error occurred." });
//   }
// };
