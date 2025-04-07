import express from "express";
import {
  uploadMealData,
  mealbyID,
  getRandomMeal,
  getWeatherMeals,
  menucategories,
  menuByFilter,
  getCategories,
  carosuelItems,
} from "../../controllers/mealContoller";

const router = express.Router();

// Just to upload data to neondb
router.post("/uploadData", uploadMealData);

//get all meal
router.get("/weatherMeals", getWeatherMeals);

//get random meals by number
router.get("/randomMeals/:id", getRandomMeal);

//get top 6 categories for item carousel
router.get("/categories", getCategories);
//get top 6 categories for item carousel
router.get("/carosuelItems", carosuelItems);

//get meal item by id
router.get("/:id", mealbyID);

// category by restaurant id
router.get("/:id/categories", menucategories);

//meal itme by restaurant id and filter
router.get("/:id/menu", menuByFilter);

export const mealRouter = router;
