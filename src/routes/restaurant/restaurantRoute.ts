import express from "express";
import {
  restaurantbyID,
  restaurantmeal,
  topbrands,
  uploadData,
} from "../../controllers/restaurantController";

const router = express.Router();

// Just to upload data to neondb
// router.post("/uploadData", uploadData);

//get top brands for menu page
router.get("/topbrands", topbrands);
router.get("/:id", restaurantbyID);
router.get("/restaurantmeal/:id", restaurantmeal);

export const restaurantRouter = router;
