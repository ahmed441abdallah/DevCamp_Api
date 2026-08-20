import { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, getBootcampStatistics } from "../controllers/Bootcamp.js";
import BootCamp from "../models/Bootcamp.js";
import express from "express";
const router = express.Router();
import reviewRouter from "./review.js"
import courseRouter from "./course.js";
import enrollmentRouter from "./enrollment.js";
import { uploadPhoto } from "../controllers/Bootcamp.js";
import { advancedResults } from "../middlewares/advancedResults.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
router.use("/:bootcampId/courses", courseRouter);
router.use('/:bootcampId/reviews', reviewRouter)
router.use('/:bootcampId/enrollments', enrollmentRouter)
router.route('/').get(advancedResults(BootCamp, "courses user reviews"), getBootcamps).post(protect, authorize("publisher"), createBootcamp);
router.route('/radius/:zip/:distance').get(getBootcampsInRadius)
router.route('/:id').get(getBootcamp).put(protect, authorize("publisher"), updateBootcamp).delete(protect, authorize("publisher"), deleteBootcamp);
router.route('/:id/photo').put(protect, authorize("publisher"), uploadPhoto);
router.route('/:id/statistics').get(getBootcampStatistics);

export default router;
