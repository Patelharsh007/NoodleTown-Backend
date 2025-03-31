import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/authServices";
import { UserReq } from "../types/type";
import jwt from "jsonwebtoken";
export const verifyTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    console.log("No token found in cookies.");
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
    console.error("Error verifying token:", error);
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ status: "error", message: "Token has expired." });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ status: "error", message: "Invalid token." });
      return;
    }
    res.status(500).json({
      status: "error",
      message: "Server error during token verification.",
    });
    return;
  }
};
