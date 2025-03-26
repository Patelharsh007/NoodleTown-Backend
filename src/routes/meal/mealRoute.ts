import express from "express";
import { uploadMealData } from "../../controllers/mealCOntoller";

const router = express.Router();

// Just to upload data to neondb
router.post("/uploadData", uploadMealData);

export const mealRouter = router;
