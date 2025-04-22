import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterValidation {
  @MinLength(3, { message: "Username must be at least 3 characters long." })
  @IsNotEmpty({ message: "Username is required." })
  userName: string;

  @IsEmail({}, { message: "Please provide a valid email address." })
  @IsNotEmpty()
  email: string;

  @MinLength(6, { message: "Password must be at least 6 characters long." })
  @IsNotEmpty()
  password: string;
}

export class LoginValidation {
  @IsEmail({}, { message: "Please provide a valid email address." })
  @IsNotEmpty()
  email: string;

  @MinLength(6, { message: "Password must be at least 6 characters long." })
  @IsNotEmpty()
  password: string;
}
