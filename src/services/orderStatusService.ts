import cron from "node-cron";
import { orderRepository } from "../repositories/dataRepositories";
import { OrderEntity } from "../entities/Order";

const PROCESSING_TO_SHIPPED_TIME = 5; // minutes
const SHIPPED_TO_DELIVERED_TIME = 30; // minutes

export const scheduleOrderStatusUpdates = () => {
  // Run every 5 minute
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      // Update processing orders to shipped
      const processingOrders = await orderRepository.find({
        where: {
          status: "processing",
          payment_status: "completed",
        },
      });

      for (const order of processingOrders) {
        const orderTime = new Date(order.ordered_at);
        const minutesSinceOrder =
          (now.getTime() - orderTime.getTime()) / (1000 * 60);

        if (minutesSinceOrder >= PROCESSING_TO_SHIPPED_TIME) {
          order.status = "shipped";
          await orderRepository.save(order);
          console.log(`Order ${order.id} status updated to shipped`);
        }
      }

      // Update shipped orders to delivered
      const shippedOrders = await orderRepository.find({
        where: {
          status: "shipped",
          payment_status: "completed",
        },
      });

      for (const order of shippedOrders) {
        const orderTime = new Date(order.ordered_at);
        const minutesSinceOrder =
          (now.getTime() - orderTime.getTime()) / (1000 * 60);

        if (minutesSinceOrder >= SHIPPED_TO_DELIVERED_TIME) {
          order.status = "completed";
          await orderRepository.save(order);
          console.log(`Order ${order.id} status updated to completed`);
        }
      }
    } catch (error) {
      console.error("Error in order status update cron job:", error);
    }
  });
};
