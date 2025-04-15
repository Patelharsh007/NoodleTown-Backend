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

export const getOrders = async (userId: number) => {
  return await orderRepository.find({
    where: { user: { id: userId } },
    relations: ["items"],
  });
};

export const placeOrder = async (
  userId: number,
  discount: number,
  addressId: UUID
) => {
  const delivery = 40; //default from forntend

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
    status: "pending",
    subTotal,
    discount,
    delivery: delivery,
    total,
    address: {
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      pincode: addressData.pincode,
    },
    stripePaymentId: "default",
    paymentStatus: "pending",
  });

  return await orderRepository.save(order);
};

export const setOrderItems = async (order: OrderEntity, userId: number) => {
  const cartItems = await getCartbyUser(userId);

  const orderItems = cartItems.map((item) =>
    orderItemsRepository.create({
      order,
      itemName: item.meal.title,
      image: item.meal.image,
      quantity: item.quantity,
      price: Number(item.meal.price),
      itemTotal: item.meal.price * item.quantity,
    })
  );

  return await orderItemsRepository.save(orderItems);
};

export const updateOrder = async (orderId: string) => {
  const order = await orderRepository.findOne({
    where: { id: Number(orderId) },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = "pending";
  order.paymentStatus = "completed";

  await orderRepository.save(order);
};
