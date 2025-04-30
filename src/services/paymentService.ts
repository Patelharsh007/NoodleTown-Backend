import Stripe from "stripe";
import { OrderEntity } from "../entities/Order";
import { orderRepository } from "../repositories/dataRepositories";
import { OrderItemEntity } from "../entities/OrderItem";
import { placeOrder, setOrderItems } from "./orderServices";
import { emptyCart } from "./cartServices";
import { UUID } from "crypto";

import { CartItemEntity } from "../entities/CartItem";
import { PaymentStatus } from "../types/type";
import { OrderStatus } from "../types/type";


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
    cartItems: CartItemEntity[];
    subTotal: number;
    delivery: number;
  }
) => {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

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


  // if (orderData.delivery > 0) {
  //   lineItems.push({
  //     price_data: {
  //       currency: "inr",
  //       product_data: {
  //         name: "Delivery Charges",
  //       },
  //       unit_amount: orderData.delivery * 100,
  //     },
  //     quantity: 1,
  //   });
  // }


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
  const session_id = session.id;

  if (!userId || !addressId) {
    throw new Error("Missing required metadata in session");
  }


  const order = await placeOrder(
    userId,
    discount,
    addressId as UUID,
    session_id
  );
  const orderItems = await setOrderItems(order, userId);

  // order.stripe_payment_id = session.id;
  order.status = OrderStatus.PROCESSING;
  order.payment_status = PaymentStatus.COMPLETED;

  await orderRepository.save(order);
  await emptyCart(userId);
  // return { order, orderItems };
  return;
};

export const verifyPaymentSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};
