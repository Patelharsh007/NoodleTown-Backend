import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userRepository } from "../repositories/dataRepositories";
import { User } from "../types/type";

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
export const verifyPassword = async (password: string, dbpassword: string) => {
  return await bcrypt.compare(password, dbpassword);
};

export const findUserByEmail = async (email: string) => {
  return await userRepository.findOne({
    where: { email: email },
  });
};

export const createNewUser = async ({ userName, email, password }: User) => {
  const newUser = userRepository.create({
    userName,
    email,
    password,
  });
  return await userRepository.save(newUser);
};

export const generateAccessToken = (
  id: number,
  email: string,
  userName: string
): string => {
  const secret = process.env.SECRET as string;
  const payload = { id, userName, email };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return token;
};

export const verifyAccessToken = (token: string) => {
  const secret = process.env.SECRET as string;
  return jwt.verify(token, secret);
};
