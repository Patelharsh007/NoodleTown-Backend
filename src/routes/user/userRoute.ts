import express from "express";

import { authenticateUserMiddleware } from "../../middlewares/authenticateUserMiddleware";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../controllers/addressContoller";
import {
  verifyUser,
  updatePassword,
  changeProfileImage,
} from "../../controllers/userController";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// router.use(authenticateUserMiddleware);

// router.get("/all", verifyTokenMiddleware, getUsers);
router.get("/verifyUser", authenticateUserMiddleware, verifyUser);

router.use(authenticateUserMiddleware);

//update password
router.post("/updatePassword", updatePassword);

router.post(
  "/changeProfileImage",
  upload.single("profileImage"),
  changeProfileImage
);

//get all user address
router.get("/addresses", getAddresses);

//add new user address
router.post("/addAddress", addAddress);

//update user address
router.patch("/updateAddress/:addressId", updateAddress);

//delete user address
router.delete("/deleteAddress/:addressId", deleteAddress);

export const userRouter = router;
