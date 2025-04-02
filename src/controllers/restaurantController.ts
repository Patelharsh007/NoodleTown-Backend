import { Request, Response } from "express";
import { AppDataSource } from "../db/db.config";
import { RestaurantEntity } from "../entities/Restaurant";
import { restaurants } from "../data/restaurantsData";
import {
  getBrands,
  // getFilteredMenu,
  getMenuCategories,
  getRestaurantById,
  getRestaurantMeal,
  getSearchResult,
} from "../services/restaurantServices";
import { restaurantRepository } from "../repositories/dataRepositories";

// Top-Brands in menu page
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

//get restuarnt by id for restaurant page
export const restaurantbyID = async (req: Request, res: Response) => {
  const restaurantId = req.params.id;

  if (restaurantId) {
    try {
      const restaurant = await getRestaurantById(restaurantId);

      if (restaurant) {
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

//to upload data from postman
export const uploadData = async (req: Request, res: Response) => {
  const data = restaurants;
  try {
    // Insert all the data in one go
    const result = await restaurantRepository.insert(data);

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

      if (restaurant) {
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
      res.status(400).json({ status: "error", message: "Error occured" });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "No restaurants id passed..." });
  }
};

export const searchBarRestaurant = async (req: Request, res: Response) => {
  const cityParam = req.query.city as string;
  const valueParam = req.query.value as string;

  if (cityParam && valueParam) {
    console.log(cityParam, valueParam);
    try {
      const { restaurantData } = await getSearchResult(cityParam, valueParam);

      if (restaurantData.length > 0) {
        res.status(201).json({
          status: "success",
          message: "Search Data fetched succesfully",
          restaurantData,
        });
      } else {
        res
          .status(400)
          .json({ status: "error", message: "No restaurant found" });
      }
    } catch (error) {
      res.status(400).json({ status: "error", message: "Some error occured" });
    }
  } else {
    res.status(400).json({ status: "error", message: "Some error occured" });
  }
};
export const searchBarMeal = async (req: Request, res: Response) => {
  const cityParam = req.query.city as string;
  const valueParam = req.query.value as string;

  if (cityParam && valueParam) {
    console.log(cityParam, valueParam);
    try {
      const { mealsData } = await getSearchResult(cityParam, valueParam);

      if (mealsData.length > 0) {
        res.status(201).json({
          status: "success",
          message: "Search Data fetched succesfully",
          mealsData,
        });
      } else {
        res.status(400).json({ status: "error", message: "No Meal found" });
      }
    } catch (error) {
      res.status(400).json({ status: "error", message: "Some error occured" });
    }
  } else {
    res.status(400).json({ status: "error", message: "Some error occured" });
  }
};
