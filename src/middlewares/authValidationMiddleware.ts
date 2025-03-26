import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import {
  LoginValidation,
  RegisterValidation,
} from "../validations/authValidation";

// Helper function to format validation errors
const formatValidationErrors = (errors: any[]) => {
  const formattedErrors: any[] = [];

  errors.forEach((error) => {
    const field = error.property;
    const constraints = error.constraints;

    // Check if there are multiple constraints (like length and pattern)
    if (constraints) {
      Object.values(constraints).forEach((message) => {
        formattedErrors.push({ field, message });
      });
    }
  });

  return formattedErrors;
};

// Middleware to validate registration input
export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName, email, password } = req.body;

  const registerValidation = new RegisterValidation();
  registerValidation.userName = userName;
  registerValidation.email = email;
  registerValidation.password = password;

  const errors = await validate(registerValidation); // Validate the object

  if (errors.length > 0) {
    const formattedErrors = formatValidationErrors(errors);
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }
  next();
};

// Middleware to validate login input
export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const loginValidation = new LoginValidation();
  loginValidation.email = email;
  loginValidation.password = password;

  const errors = await validate(loginValidation);

  if (errors.length > 0) {
    const formattedErrors = formatValidationErrors(errors);
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }
  next();
};
