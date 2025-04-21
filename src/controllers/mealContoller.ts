import { Request, Response } from "express";
import { AppDataSource } from "../db/db.config";

import { MealEntity } from "../entities/Meal";
import { meals } from "../data/meals";
import {
  getCarosuelCategories,
  getCarosuelItems,
  getMealById,
  getMenu,
  getMenuCategories,
  getRandomNMeals,
  weatherMeals,
} from "../services/mealServices";

export const uploadMealData = async (req: Request, res: Response) => {
  const data = meals;
  try {
    const myEntityRepository = AppDataSource.getRepository(MealEntity);

    const result = await myEntityRepository.insert(data);

    console.log(`${result.identifiers.length} records inserted.`);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(200).json({ status: "error" });
  }
};

export const mealbyID = async (req: Request, res: Response) => {
  const restaurantId = req.params.id;

  if (restaurantId) {
    try {
      const meal = await getMealById(restaurantId);

      if (meal) {
        res.status(201).json({
          status: "success",
          message: "Meals Details fetched succesfully",
          meal,
        });
      } else {
        res.status(400).json({ status: "error", message: "No Meal found" });
      }
    } catch (error) {
      res.status(400).json({ status: "error", message: error });
    }
  } else {
    res.status(400).json({ status: "error", message: "No Meal id passed..." });
  }
};

export const getWeatherMeals = async (req: Request, res: Response) => {
  try {
    const meals = await weatherMeals();

    if (meals) {
      res.status(201).json({
        status: "success",
        message: "Meals Details fetched succesfully",
        meals,
      });
    } else {
      res
        .status(400)
        .json({ status: "error", message: "No Meal found.........", meals });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
};

export const getRandomMeal = async (req: Request, res: Response) => {
  const number = req.params.id;

  if (number) {
    try {
      const meals = await getRandomNMeals(number);

      if (meals.length > 0) {
        res.status(201).json({
          status: "success",
          message: "Meals Details fetched succesfully",
          meals,
        });
      } else {
        res.status(400).json({ status: "error", message: "No Meal found" });
      }
    } catch (error) {
      res.status(400).json({ status: "error", message: error });
    }
  } else {
    res.status(400).json({ status: "error", message: "No Meal id passed..." });
  }
};

export const menuByFilter = async (req: Request, res: Response) => {
  const restaurantId = req.params.id;
  const categoryFilter = req.query.category as string;

  console.log(restaurantId, categoryFilter);

  if (restaurantId) {
    try {
      const menu = await getMenu(restaurantId, categoryFilter);

      if (menu.length > 0) {
        res.status(201).json({
          status: "success",
          message: "Menu  fetched succesfully",
          menu,
        });
      } else {
        res
          .status(400)
          .json({ status: "error", message: "No categories found" });
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
export const menucategories = async (req: Request, res: Response) => {
  const restaurantId = req.params.id;

  if (restaurantId) {
    try {
      const categoriesCount = await getMenuCategories(restaurantId);

      if (categoriesCount.length > 0) {
        res.status(201).json({
          status: "success",
          message: "Menu Categories fetched succesfully",
          categoriesCount,
        });
      } else {
        res
          .status(400)
          .json({ status: "error", message: "No categories found" });
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
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCarosuelCategories();

    if (categories.length > 0) {
      res.status(201).json({
        status: "success",
        message: "Categories fetched succesfully",
        categories,
      });
    } else {
      res.status(400).json({ status: "error", message: "No categories found" });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
};
export const carosuelItems = async (req: Request, res: Response) => {
  const category = req.query.category as string;
  try {
    const carosuelItem = await getCarosuelItems(category);

    if (carosuelItem.length > 0) {
      res.status(201).json({
        status: "success",
        message: "Menu Categories fetched succesfully",
        carosuelItem,
      });
    } else {
      res.status(400).json({ status: "error", message: "No categories found" });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
};
