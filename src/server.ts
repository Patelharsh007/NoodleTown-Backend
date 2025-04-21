import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./db/db.config";
import { authRouter } from "./routes/auth/authRoute";
import { userRouter } from "./routes/user/userRoute";
import { restaurantRouter } from "./routes/restaurant/restaurantRoute";
import { mealRouter } from "./routes/meal/mealRoute";
import { cartRouter } from "./routes/cart/cartRoute";
import { orderRouter } from "./routes/order/orderRoute";
import { stripeRouter } from "./routes/stripe/stripeRouter";
import { scheduleOrderStatusUpdates } from "./services/orderStatusService";

dotenv.config();

const app = express();

scheduleOrderStatusUpdates();

//stripe webhook
app.use("/", stripeRouter);

//middlewares
app.use(express.json());
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: [
      "https://noodle-town-frontend.vercel.app",
      process.env.FRONTEND_URL!,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.options("*", cors());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/meal", mealRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

//Initialize database
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database successfully.....");

    const port = process.env.PORT || 8080;

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
