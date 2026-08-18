import express from "express";
import { protect } from "../middlewares/auth.js";
import { addToWishlist, getWishlist, clearWishlist, removeFromWishlist } from "../controllers/wishlist.js";

const router = express.Router();

router.route("/:bootcampId").post(protect, addToWishlist);
router.route("/").get(protect, getWishlist);
router.route("/:bootcampId").delete(protect, removeFromWishlist);
router.route("/").delete(protect, clearWishlist)
export default router;