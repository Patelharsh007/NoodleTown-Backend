import express from "express";

import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import { getUsers } from "../../controllers/userController";

const router = express.Router();

router.get("/all", verifyTokenMiddleware, getUsers);

export const userRouter = router;
