import express from "express";
import {
  // menucategories,
  // menuItems,
  restaurantbyID,
  restaurantmeal,
  searchBarMeal,
  searchBarRestaurant,
  topbrands,
  uploadData,
} from "../../controllers/restaurantController";

const router = express.Router();

// Just to upload data to neondb
// router.post("/uploadData", uploadData);

//get top brands for menu page
router.get("/topbrands", topbrands);
router.get("/restaurantmeal/:id", restaurantmeal);
router.get("/searchMeal", searchBarMeal);
router.get("/searchRestaurant", searchBarRestaurant);
router.get("/:id", restaurantbyID);
// router.get("/:id/categories", menucategories);
// router.get("/:id/menu", menuItems);

export const restaurantRouter = router;
