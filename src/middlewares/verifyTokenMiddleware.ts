import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/authServices";

export const verifyTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    res.status(401).json({ message: "User is not authenticated" });
    return;
  }

  try {
    const decodedToken = verifyAccessToken(token);
    req.body = decodedToken;
    return next();
  } catch (error) {
    res.status(401).json({ message: `Error occurred: ${error}` });
    return;
  }
};
