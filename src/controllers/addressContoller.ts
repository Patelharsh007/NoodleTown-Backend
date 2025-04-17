import { Request, Response } from "express";
import {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
} from "../services/addressServices";
import { findUserById } from "../services/authServices";

// get addresses
export const getAddresses = async (req: Request, res: Response) => {
  const userId = req.user?.id as number;
  if (userId) {
    try {
      const addresses = await getUserAddresses(userId);

      if (addresses.length !== 0) {
        res.status(200).json({
          status: "success",
          message: "Addresses fetched successfully",
          addresses,
        });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "No address data found." });
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

// Add new address
export const addAddress = async (req: Request, res: Response) => {
  const userId = req.user?.id as number;
  const address = req.body.address;

  if (!userId) {
    res.status(403).json({
      status: "error",
      message: "User not authenticated",
    });
    return;
  }

  if (!address) {
    res.status(400).json({
      status: "error",
      message: "Address is required",
    });
    return;
  }

  try {
    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    const newAddress = await addUserAddress(user, address);

    if (!newAddress) {
      // Address already exists — no crash, just a nice message
      res.status(400).json({
        status: "error",
        message: "Duplicate address detected",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding new address:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again.",
    });
  }
};

// update address
export const updateAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params;
  const updatedFields = req.body;
  const userId = req.user?.id as number;

  if (!userId) {
    res.status(403).json({
      status: "error",
      message: "User not authenticated",
    });
    return;
  }

  if (!addressId) {
    res.status(400).json({ message: "Address ID is required" });
    return;
  }

  try {
    const result = await updateUserAddress(userId, addressId, updatedFields);

    if (result === null) {
      res.status(404).json({ status: "error", message: "Address not found" });
      return;
    } else if (result === "duplicate") {
      res
        .status(409)
        .json({ status: "error", message: "Duplicate address detected" });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Address updated succesfully",
      updatedAddress: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the address",
    });
  }
};
// delete address
export const deleteAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params;
  const userId = req.user?.id as number;

  if (!userId) {
    res.status(403).json({
      status: "error",
      message: "User not authenticated",
    });
    return;
  }

  if (!addressId) {
    res.status(400).json({ message: "Address ID is required" });
    return;
  }

  try {
    const result = await deleteUserAddress(userId, addressId);

    if (result === null) {
      res.status(404).json({ status: "error", message: "Address not found" });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Address deleted succesfully",
      updatedAddress: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the address",
    });
  }
};
