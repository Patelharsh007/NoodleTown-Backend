import { Request, Response } from "express";

import {
  addMealToCart,
  findCartByMealAndUser,
  getCartbyUser,
  getCartMealbyUser,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
  emptyCart,
} from "../services/cartServices";

export const getCartData = async (req: Request, res: Response) => {
  const userEmail = req.user?.email;

  if (userEmail) {
    try {
      const cartItem = await getCartbyUser(userEmail);

      if (cartItem.length !== 0) {
        res.status(200).json({
          status: "success",
          message: "Cart data feteched succesfully",
          cartItem,
        });
      } else {
        res
          .status(400)
          .json({ status: "error", message: "No cart data found." });
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      res
        .status(400)
        .json({ status: "error", message: "Error retrieving cart data." });
    }
  } else {
    res.status(403).json({ status: "error", message: "No user found" });
  }
};
export const getCartMealData = async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const userEmail = req.user?.email;

  if (mealId && userEmail) {
    try {
      const cartItem = await getCartMealbyUser(mealId, userEmail);

      // if (cartItem) {
      //   res.status(200).json({
      //     status: "success",
      //     message: "Cart data feteched succesfully",
      //     isInCart: !!cartItem,
      //   });
      // } else {
      res.status(200).json({
        status: "success",
        // message: "No cart data found.",
        isInCart: !!cartItem,
      });
      // }
    } catch (error) {
      console.error("Error retrieving data:", error);
      res
        .status(400)
        .json({ status: "error", message: "Error retrieving cart data." });
    }
  } else {
    res.status(403).json({ status: "error", message: "No mealId found" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const userEmail = req.user?.email;

  if (mealId && userEmail) {
    try {
      const data = await findCartByMealAndUser(mealId, userEmail);
      if (data) {
        res
          .status(400)
          .json({ status: "error", message: "Item Already in Cart" });
      } else {
        const cartItem = await addMealToCart(mealId, userEmail);

        res.status(201).json({
          status: "success",
          message: "Meal added to the cart successfully.",
          cartItem,
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error adding to the cart." });
    }
  } else {
    res.status(400).json({ status: "error", message: "No mealId provided." });
  }
};
export const removeFromCart = async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const userEmail = req.user?.email;

  if (mealId && userEmail) {
    try {
      const data = await findCartByMealAndUser(mealId, userEmail);
      if (data) {
        await removeCartItem(mealId, userEmail);
        res
          .status(200)
          .json({ status: "success", message: "Item removed from Cart" });
      } else {
        res.status(400).json({
          status: "error",
          message: "Item not in cart",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error adding to the cart." });
    }
  } else {
    res.status(400).json({ status: "error", message: "No mealId provided." });
  }
};

export const incrementItem = async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const userEmail = req.user?.email;

  if (mealId && userEmail) {
    try {
      const data = await findCartByMealAndUser(mealId, userEmail);
      if (data) {
        if (data.quantity >= 5) {
          res.status(400).json({
            status: "error",
            message: "Item quantity cannot exceed limit 5.",
          });
        } else {
          const updatedData = await incrementCartItem(mealId, userEmail);
          res.status(200).json({
            status: "success",
            message: "Item updated in cart successfully.",
            updatedData,
          });
        }
      } else {
        res.status(400).json({
          status: "error",
          message: "Item not in cart",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error adding to the cart." });
    }
  } else {
    res.status(400).json({ status: "error", message: "No mealId provided." });
  }
};

export const decrementItem = async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const userEmail = req.user?.email;

  if (mealId && userEmail) {
    try {
      const data = await findCartByMealAndUser(mealId, userEmail);
      if (data) {
        if (data.quantity === 1) {
          await removeCartItem(mealId, userEmail); //remove meal from record
          res.status(200).json({
            status: "success",
            message: "Item removed from cart.",
          });
        } else {
          const updatedData = await decrementCartItem(mealId, userEmail);
          res.status(200).json({
            status: "success",
            message: "Item updated in cart successfully.",
            updatedData,
          });
        }
      } else {
        res.status(400).json({
          status: "error",
          message: "Item not in cart",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error adding to the cart." });
    }
  } else {
    res.status(400).json({ status: "error", message: "No mealId provided." });
  }
};
export const clearCart = async (req: Request, res: Response) => {
  const userEmail = req.user?.email;

  if (userEmail) {
    try {
      const data = await getCartbyUser(userEmail);
      console.log("Data", data);

      if (data.length !== 0) {
        await emptyCart(userEmail);

        res.status(200).json({
          status: "success",
          message: "Cart emptied succesfully",
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Cart is already empty.",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ status: "error", message: "Error clearing the cart." });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "No user-email provided" });
  }
};
