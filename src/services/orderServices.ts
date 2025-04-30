import { UUID } from "crypto";
import {
  addressRepository,
  cartRepository,
  orderItemsRepository,
  orderRepository,
} from "../repositories/dataRepositories";
import { getCartbyUser } from "./cartServices";
import { OrderEntity } from "../entities/Order";
import { findUserById } from "./authServices";
import { OrderStatus } from "../types/type";
import { PaymentStatus } from "../types/type";

export const getOrders = async (userId: number) => {
  return await orderRepository.find({
    where: { user: { id: userId } },
    relations: ["items"],
    order: { id: "DESC" },
  });
};

export const placeOrder = async (
  userId: number,
  discount: number,
  addressId: UUID,
  session_id: string
) => {
  const delivery = 40;

  const cartItems = await getCartbyUser(userId);

  const addressData = await addressRepository.findOne({
    where: { id: addressId },
  });

  if (!addressData) {
    throw new Error("Address not found");
  }

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.meal.price * item.quantity,
    0
  );

  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const total = subTotal - discount + delivery;

  const order = orderRepository.create({
    user,
    status: OrderStatus.PROCESSING,
    sub_total: subTotal,
    discount,
    delivery: delivery,
    total,
    address: {
      name: addressData.name,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      pincode: addressData.pincode,
    },
    stripe_payment_id: session_id,
    payment_status: PaymentStatus.COMPLETED,
  });

  return await orderRepository.save(order);
};

export const setOrderItems = async (order: OrderEntity, userId: number) => {
  const cartItems = await getCartbyUser(userId);

  const orderItems = cartItems.map((item) =>
    orderItemsRepository.create({
      order,
      item_name: item.meal.title,
      image: item.meal.image,
      quantity: item.quantity,
      price: Number(item.meal.price),
      item_total: item.meal.price * item.quantity,
    })
  );

  return await orderItemsRepository.save(orderItems);
};

// export const updateOrder = async (orderId: string) => {
//   const order = await orderRepository.findOne({
//     where: { id: Number(orderId) },
//   });

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   order.status = "processing";
//   order.payment_status = "completed";

//   await orderRepository.save(order);
// };
