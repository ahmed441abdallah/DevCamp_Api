import express from "express";
import bootcamps from "./Bootcamp.js";
import courses from "./course.js";
import auth from "./auth.js";
import users from "./users.js";
import reviews from "./review.js";
import wishlist from "./wishlist.js";
import enrollments from "./enrollment.js";
import { authLimiter } from "../controllers/rateLimiter.js";
const router = express.Router();
router.use("/bootcamps", bootcamps);
router.use("/courses", courses);
router.use("/auth", authLimiter, auth);
router.use("/users", users);
router.use("/reviews", reviews);
router.use("/wishlist", wishlist);
router.use("/enrollments", enrollments);

export default router;