import { Request, Response } from "express";
import { AppDataSource } from "../db/db.config";
import { RestaurantEntity } from "../entities/Restaurant";
import { restaurants } from "../data/restaurantsData";
import {
  getBrands,
  getRestaurantById,
  getRestaurantMeal,
} from "../services/restaurantServices";

export const topbrands = async (req: Request, res: Response) => {
  try {
    const restaurants = await getBrands();

    if (restaurants) {
      res.status(201).json({
        status: "success",
        message: "Restaurants fetched succesfully",
        restaurants,
      });
    } else {
      res
        .status(400)
        .json({ status: "error", message: "No restaurants found..." });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
};

export const restaurantbyID = async (req: Request, res: Response) => {
  const restaurantId = req.params.id;

  if (restaurantId) {
    try {
      const restaurant = await getRestaurantById(restaurantId);

      if (restaurant.length > 0) {
        res.status(201).json({
          status: "success",
          message: "Restaurant Details fetched succesfully",
          restaurant,
        });
      } else {
        res
          .status(400)
          .json({ status: "error", message: "No restaurant found" });
      }
    } catch (error) {
      res.status(400).json({ status: "error", message: error });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "No restaurants id passed..." });
  }
};

export const uploadData = async (req: Request, res: Response) => {
  const data = restaurants;
  try {
    // Get the repository for the entity
    const myEntityRepository = AppDataSource.getRepository(RestaurantEntity);

    // Insert all the data in one go
    const result = await myEntityRepository.insert(data);

    console.log(`${result.identifiers.length} records inserted.`);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(400).json({ status: "error", message: error });
  }
};

export const restaurantmeal = async (req: Request, res: Response) => {
  const restaurantId = req.params.id;

  if (restaurantId) {
    try {
      const restaurant = await getRestaurantMeal(restaurantId);

      if (restaurant.length > 0) {
        res.status(201).json({
          status: "success",
          message: "Restaurant Details fetched succesfully",
          restaurant,
        });
      } else {
        res
          .status(400)
          .json({ status: "error", message: "No restaurant found" });
      }
    } catch (error) {
      res.status(400).json({ status: "error", message: error });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "No restaurants id passed..." });
  }
};
