import express from "express";
import {
  uploadMealData,
  mealbyID,
  getRandomMeal,
  getWeatherMeals,
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

export const mealRouter = router;
