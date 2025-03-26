import express from "express";

import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import { getUsers, verifyUser } from "../../controllers/userController";

const router = express.Router();

router.get("/all", verifyTokenMiddleware, getUsers);
router.get("/verifyUser", verifyTokenMiddleware, verifyUser);

export const userRouter = router;
