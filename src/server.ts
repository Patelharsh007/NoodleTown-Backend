import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "./db/db.config";
import { authRouter } from "./routes/auth/authRoute";

//configiring with .env file
dotenv.config();

//Creating Express App
const app = express();

app.use(express.json());

//Routes

app.use("/auth", authRouter);

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
