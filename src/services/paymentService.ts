import Stripe from "stripe";
import { OrderEntity } from "../entities/Order";
import { orderRepository } from "../repositories/dataRepositories";
import { OrderItemEntity } from "../entities/OrderItem";
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables."
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentSession = async (
  order: OrderEntity,
  orderItems: OrderItemEntity[]
) => {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  // 1. Add all real order items with correct price
  for (const item of orderItems) {
    lineItems.push({
      price_data: {
        currency: "inr", // or "usd" if needed
        product_data: {
          name: item.itemName,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in paise
      },
      quantity: item.quantity,
    });
  }

  // 2. Optionally add delivery fee
  const deliveryFee = 40; // Set as per your business logic
  if (deliveryFee > 0) {
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryFee * 100,
      },
      quantity: 1,
    });
  }

  // 3. Apply discount as a negative line item
  let couponId: string | undefined = undefined;

  if (order.discount > 0) {
    const existingCoupons = await stripe.coupons.list({ limit: 100 });
    const matchedCoupon = existingCoupons.data.find(
      (c) => c.amount_off === order.discount * 100 && c.currency === "inr"
    );

    if (matchedCoupon) {
      couponId = matchedCoupon.id;
    } else {
      const newCoupon = await stripe.coupons.create({
        amount_off: Math.round(order.discount * 100),
        currency: "inr",
        duration: "once",
      });
      couponId = newCoupon.id;
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    discounts: couponId ? [{ coupon: couponId }] : undefined,
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    metadata: {
      orderId: order.id.toString(),
    },
  });

  // Save to order
  order.stripePaymentId = session.id;
  await orderRepository.save(order);

  return { order, session };
};
export const verifyPaymentSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return session;
};
