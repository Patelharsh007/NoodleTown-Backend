import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./db/db.config";
import { authRouter } from "./routes/auth/authRoute";
import { userRouter } from "./routes/user/userRoute";

//configiring with .env file
dotenv.config();

//Creating Express App
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

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
