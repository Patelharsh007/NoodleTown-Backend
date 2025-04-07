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
          message: "Cart data fetched successfully",
          cartItem,
        });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "No cart data found." });
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server error.",
      });
    }
  } else {
    res
      .status(403)
      .json({ status: "error", message: "User not authenticated" });
  }
};

export const getCartMealData = async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const userEmail = req.user?.email;

  if (mealId && userEmail) {
    try {
      const cartItem = await getCartMealbyUser(mealId, userEmail);

      if (cartItem) {
        res.status(200).json({
          status: "success",
          message: "Cart data fetched successfully",
          cartItem,
          isInCart: true,
        });
      } else {
        res.status(200).json({
          status: "error",
          message: "Item not found in cart",
          isInCart: false,
        });
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server error.",
      });
    }
  } else {
    res.status(400).json({
      status: "error",
      message: "Missing mealId or user information.",
    });
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
          .json({ status: "error", message: "Item already in cart" });
      } else {
        const cartItem = await addMealToCart(mealId, userEmail);

        res.status(201).json({
          status: "success",
          message: "Meal added to the cart successfully.",
          cartItem,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server error.",
      });
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
          .json({ status: "success", message: "Item removed from cart" });
      } else {
        res.status(404).json({
          status: "error",
          message: "Item not found in cart",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server error.",
      });
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
            message: "Item quantity cannot exceed limit of 5.",
          });
        } else {
          const updatedData = await incrementCartItem(mealId, userEmail);
          res.status(200).json({
            status: "success",
            message: "Item incremented in cart successfully.",
            updatedData,
          });
        }
      } else {
        res.status(404).json({
          status: "error",
          message: "Item not found in cart",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server error.",
      });
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
          await removeCartItem(mealId, userEmail); // Remove meal from record
          res.status(200).json({
            status: "success",
            message: "Item removed from cart.",
          });
        } else {
          const updatedData = await decrementCartItem(mealId, userEmail);
          res.status(200).json({
            status: "success",
            message: "Item decremented in cart successfully.",
            updatedData,
          });
        }
      } else {
        res.status(404).json({
          status: "error",
          message: "Item not found in cart",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server error.",
      });
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

      if (data.length !== 0) {
        await emptyCart(userEmail);

        res.status(200).json({
          status: "success",
          message: "Cart emptied successfully",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart is already empty.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server error.",
      });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "No user-email provided" });
  }
};
