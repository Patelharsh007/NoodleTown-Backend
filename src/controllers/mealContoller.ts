import { Request, Response } from "express";
import { AppDataSource } from "../db/db.config";

import { MealEntity } from "../entities/Meal";
import { meals } from "../data/meals";

export const uploadMealData = async (req: Request, res: Response) => {
  const data = meals;
  try {
    // Get the repository for the entity
    const myEntityRepository = AppDataSource.getRepository(MealEntity);

    // Insert all the data in one go
    const result = await myEntityRepository.insert(data);

    console.log(`${result.identifiers.length} records inserted.`);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(200).json({ status: "error" });
  }
};
