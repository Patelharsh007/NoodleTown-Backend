import express from "express";
import {
  restaurantbyID,
  topbrands,
  uploadData,
} from "../../controllers/restaurantController";

const router = express.Router();

// Just to upload data to neondb
// router.post("/uploadData", uploadData);

//get top brands for menu page
router.get("/topbrands", topbrands);
router.get("/restaurant/:id", restaurantbyID);

export const restaurantRouter = router;
