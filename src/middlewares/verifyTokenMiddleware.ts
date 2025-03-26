import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/authServices";
import { UserReq } from "../types/type";

export const verifyTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token." });
    return;
  }

  try {
    const decodedToken = verifyAccessToken(token);
    req.user = decodedToken as UserReq;
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: error });
    return;
  }
};
