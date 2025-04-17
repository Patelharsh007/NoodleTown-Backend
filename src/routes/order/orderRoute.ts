import express from "express";
import { authenticateUserMiddleware } from "../../middlewares/authenticateUserMiddleware";
import {
  createOrderAndPayment,
  verifyStripePayment,
  getOrdersbyUser,
} from "../../controllers/orderController";

const router = express.Router();

router.use(authenticateUserMiddleware);

router.post("/createOrder", createOrderAndPayment);
router.get("/verifyPayment", verifyStripePayment);
router.get("/getOrders", getOrdersbyUser);

export const orderRouter = router;
