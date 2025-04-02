import express from "express";
import { login, register, logout } from "../../controllers/authController";
import {
  validateLogin,
  validateRegister,
} from "../../middlewares/authValidationMiddleware";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

export const authRouter = router;
