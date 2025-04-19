import Stripe from "stripe";
import { OrderEntity } from "../entities/Order";
import { orderRepository } from "../repositories/dataRepositories";
import { OrderItemEntity } from "../entities/OrderItem";
import { placeOrder, setOrderItems } from "./orderServices";
import { emptyCart } from "./cartServices";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables."
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentSession = async (
  userId: number,
  orderData: {
    userId: number;
    addressId: string;
    discount: number;
    cartItems: any[];
    subTotal: number;
    delivery: number;
  }
) => {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  // 1. Add all cart items with correct price
  for (const item of orderData.cartItems) {
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.meal.title,
          images: item.meal.image ? [item.meal.image] : [],
        },
        unit_amount: Math.round(item.meal.price * 100),
      },
      quantity: item.quantity,
    });
  }

  // 2. Add delivery fee
  if (orderData.delivery > 0) {
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: orderData.delivery * 100,
      },
      quantity: 1,
    });
  }

  // 3. Apply discount as a negative line item
  let couponId: string | undefined = undefined;

  if (orderData.discount > 0) {
    const existingCoupons = await stripe.coupons.list({ limit: 100 });
    const matchedCoupon = existingCoupons.data.find(
      (c) => c.amount_off === orderData.discount * 100 && c.currency === "inr"
    );

    if (matchedCoupon) {
      couponId = matchedCoupon.id;
    } else {
      const newCoupon = await stripe.coupons.create({
        amount_off: Math.round(orderData.discount * 100),
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
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: orderData.delivery * 100,
            currency: "inr",
          },
          display_name: "Standard Delivery",
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 2,
            },
          },
        },
      },
    ],
    metadata: {
      userId: userId.toString(),
      addressId: orderData.addressId,
      discount: orderData.discount.toString(),
      subTotal: orderData.subTotal.toString(),
      delivery: orderData.delivery.toString(),
    },
  });

  return { session };
};

export const handleSuccessfulPayment = async (
  session: Stripe.Checkout.Session
) => {
  const userId = parseInt(session.metadata?.userId || "0");
  const addressId = session.metadata?.addressId || "";
  const discount = parseFloat(session.metadata?.discount || "0");
  const subTotal = parseFloat(session.metadata?.subTotal || "0");
  const delivery = parseFloat(session.metadata?.delivery || "0");

  if (!userId || !addressId) {
    throw new Error("Missing required metadata in session");
  }

  // Create the order only after successful payment
  const order = await placeOrder(
    userId,
    discount,
    addressId as `${string}-${string}-${string}-${string}-${string}`
  );
  const orderItems = await setOrderItems(order, userId);

  // Update order with payment details
  order.stripePaymentId = session.id;
  order.status = "processing";
  order.paymentStatus = "completed";
  await orderRepository.save(order);

  // Clear the cart
  await emptyCart(userId);

  return { order, orderItems };
};

export const verifyPaymentSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return session;
};
