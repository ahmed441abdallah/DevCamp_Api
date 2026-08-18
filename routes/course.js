import express from "express";
import {
    getCourses,
} from "../controllers/course.js";
import { getCourse, updateCourse, deleteCourse, createCourse } from "../controllers/course.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(protect, authorize("publisher", "admin"), createCourse);
router.route('/:id').get(getCourse).put(protect, authorize("publisher", "admin"), updateCourse).delete(protect, authorize("publisher", "admin"), deleteCourse);


export default router;
