import express from "express";
import { login, register, logout } from "../../controllers/authController";
import {
  validateLogin,
  validateRegister,
} from "../../middlewares/authValidationMiddleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validateRegister,
  register
);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

export const authRouter = router;
