import express from "express";
import Stripe from "stripe";
import { handleSuccessfulPayment } from "../../services/paymentService";

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

      try {
        await handleSuccessfulPayment(session);
        console.log(`✅ Order created successfully for session ${session.id}`);
        res.status(200).send("Order created successfully");
      } catch (err: any) {
        console.error("Error creating order:", err.message);
        res.status(500).send("Failed to create order");
      }
    } else {
      res.status(200).send("Event received");
    }
  }
);

export const stripeRouter = router;
