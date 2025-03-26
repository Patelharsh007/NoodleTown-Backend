import express from "express";
import {
  restaurantList,
  uploadData,
} from "../../controllers/restaurantController";

const router = express.Router();

// Just to upload data to neondb
// router.post("/uploadData", uploadData);
router.get("/restaurantList", restaurantList);

export const restaurantRouter = router;
