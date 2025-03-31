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
} from "../services/restaurantServices";

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

// //to get list pof category and its count
// export const menucategories = async (req: Request, res: Response) => {
//   const restaurantId = req.params.id;

//   if (restaurantId) {
//     try {
//       const categoriesCount = await getMenuCategories(restaurantId);

//       if (categoriesCount.length > 0) {
//         res.status(201).json({
//           status: "success",
//           message: "Menu Categories fetched succesfully",
//           categoriesCount,
//         });
//       } else {
//         res
//           .status(400)
//           .json({ status: "error", message: "No categories found" });
//       }
//     } catch (error) {
//       res.status(400).json({ status: "error", message: error });
//     }
//   } else {
//     res
//       .status(400)
//       .json({ status: "error", message: "No restaurants id passed..." });
//   }
// };

//to get menu item of restaurant by id
//to get list pof category and its count
// export const menuItems = async (req: Request, res: Response) => {
//   const restaurantId = req.params.id;
//   const categoryFilter = req.query.category;

//   if (restaurantId) {
//     try {
//       const categoryMeal = await getFilteredMenu(restaurantId, categoryFilter);

//       if (categoryMeal.length > 0) {
//         res.status(201).json({
//           status: "success",
//           message: "Menu Categories fetched succesfully",
//           categoryMeal,
//         });
//       } else {
//         res
//           .status(400)
//           .json({ status: "error", message: "No matching data found" });
//       }
//     } catch (error) {
//       res.status(400).json({ status: "error", message: error });
//     }
//   } else {
//     res
//       .status(400)
//       .json({ status: "error", message: "No restaurants id passed..." });
//   }
// };
