//payment for order

import { Request, Response } from "express";
import { getCartbyUser, emptyCart } from "../services/cartServices";
import {
  placeOrder,
  setOrderItems,
  updateOrder,
  getOrders,
} from "../services/orderServices";
import {
  createPaymentSession,
  verifyPaymentSession,
} from "../services/paymentService";
import { UUID } from "crypto";

export const getOrdersbyUser = async (req: Request, res: Response) => {
  const userId = req.user?.id as number;
  try {
    if (!userId) {
      res.status(400).json({
        status: "error",
        message: "User not log-in",
      });
      return;
    }

    const orders = await getOrders(userId);

    if (orders.length === 0) {
      res.status(400).json({
        status: "error",
        message: "No order found",
      });
      return;
    }

    res.status(200).json({
      status: "error",
      message: "Orders fetched succesfully",
      orders: orders,
    });
    return;
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server error.",
    });
  }
};

export const createOrderAndPayment = async (req: Request, res: Response) => {
  const userId = req.user?.id as number;
  const addressId = req.body.addressId as UUID;
  const discount = (req.body.discount as number) || 0;

  try {
    if (!userId) {
      res.status(400).json({
        status: "error",
        message: "User not log-in",
      });
      return;
    }

    const cartItems = await getCartbyUser(userId);

    if (cartItems.length === 0) {
      res.status(400).json({
        status: "error",
        message: "Cart is empty",
      });
      return;
    }

    const order = await placeOrder(userId, discount, addressId);

    const orderItems = await setOrderItems(order, userId);

    const { order: updatedOrder, session } = await createPaymentSession(
      order,
      orderItems
    );

    res.status(200).json({
      status: "success",
      orderId: order.id,
      session: session.id,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server error.",
    });
  }
};

export const verifyStripePayment = async (req: Request, res: Response) => {
  const userId = req.user?.id as number;
  const sessionId = req.query.session_id as string;

  try {
    const session = await verifyPaymentSession(sessionId);

    console.log("Session", session);

    if (session.payment_status === "paid") {
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        res.status(400).json({
          status: "error",
          message: "Order not found.",
        });
        return;
      }

      const order = await updateOrder(orderId);

      const delelteCart = await emptyCart(userId);

      res
        .status(200)
        .json({ success: true, order, message: "Payment succesfully " });
      return;
    } else {
      res.status(400).json({ message: "Payment not successful yet." });
      return;
    }
  } catch (error) {
    console.error("Stripe verification failed", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
