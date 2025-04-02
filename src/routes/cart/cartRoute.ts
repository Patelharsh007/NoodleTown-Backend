import express from "express";
import { authenticateUserMiddleware } from "../../middlewares/authenticateUserMiddleware";
import {
  addToCart,
  clearCart,
  decrementItem,
  getCartData,
  getCartMealData,
  incrementItem,
  removeFromCart,
} from "../../controllers/cartController";

const router = express.Router();

//all cart routes are authenticated
router.use(authenticateUserMiddleware);

//whole cart table irrespective of  user
router.get("/allCartData", getCartData);

//get cart meal item with meal details
router.get("/cartMeal/:id", getCartMealData);

//add meal to cart based on mealID and user logged in
router.post("/addToCart/:id", addToCart);

//remove meal from cart based on mealID and user logged in
router.delete("/removeFromCart/:id", removeFromCart);

//increment quantity of mealid
router.put("/increment/:id", incrementItem);

//increment quantity of mealid
router.put("/decrement/:id", decrementItem);

//clear cart for user
router.delete("/clearCart", clearCart);

export const cartRouter = router;
