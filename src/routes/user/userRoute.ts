import express from "express";

import { authenticateUserMiddleware } from "../../middlewares/authenticateUserMiddleware";
import { verifyUser } from "../../controllers/userController";

const router = express.Router();

// router.get("/all", verifyTokenMiddleware, getUsers);
router.get("/verifyUser", authenticateUserMiddleware, verifyUser);

export const userRouter = router;
