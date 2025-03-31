import express from "express";
import {
  uploadMealData,
  mealbyID,
  getRandomMeal,
  getWeatherMeals,
  menucategories,
  menuByFilter,
} from "../../controllers/mealContoller";

const router = express.Router();

// Just to upload data to neondb
// router.post("/uploadData", uploadMealData);

//get all meal
router.get("/weatherMeals", getWeatherMeals);

//get meal item by id
router.get("/:id", mealbyID);

//get random meals by number
router.get("/randomMeals/:id", getRandomMeal);

// category by restaurant id
router.get("/:id/categories", menucategories);

//meal itme by restaurant id and filter
router.get("/:id/menu", menuByFilter);

export const mealRouter = router;
