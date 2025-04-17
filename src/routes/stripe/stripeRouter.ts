import express from "express";
import Stripe from "stripe";
import { updateOrder } from "../../services/orderServices";
import { emptyCart } from "../../services/cartServices";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables."
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (!userId) {
        res.status(400).send("User ID not found in metadata");
        return;
      }

      if (!orderId) {
        res.status(400).send("Order ID not found in metadata");
        return;
      }

      try {
        await updateOrder(orderId);
        const delelteCart = await emptyCart(Number(userId));
        console.log(`✅ Order ${orderId} updated successfully`);
        res.status(200).send("Order status updated");
      } catch (err: any) {
        console.error("Error updating order:", err.message);
        res.status(500).send("Failed to update order");
      }
    } else {
      res.status(200).send("Event received");
    }
  }
);

export const stripeRouter = router;
