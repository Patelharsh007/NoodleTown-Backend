import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import {
  LoginValidation,
  RegisterValidation,
} from "../validations/authValidation";

// Helper function to format validation errors
const formatValidationErrors = (errors: any[]) => {
  return errors.map((error) => {
    const field = error.property;
    const message = Object.values(error.constraints || {}).join(", ");
    return { field, message };
  });
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
    // Format and send the error response
    const formattedErrors = formatValidationErrors(errors);
    res
      .status(400)
      .json({ message: "Validation failed", errors: formattedErrors });
    return;
  }
  next(); // If no errors, pass control to the next middleware/controller
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

  const errors = await validate(loginValidation); // Validate the object

  if (errors.length > 0) {
    // Format and send the error response
    const formattedErrors = formatValidationErrors(errors);
    res
      .status(400)
      .json({ message: "Validation failed", errors: formattedErrors });
    return;
  }
  next(); // If no errors, pass control to the next middleware/controller
};
