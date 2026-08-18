import { catchAsync } from "../utils/catchAsync.js";
import Course from "../models/Course.js";
// @desc get all courses and populate bootcamp 
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
export const getCourses = catchAsync(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId }).populate("bootcamp", "name description");
    } else {
        query = Course.find().populate("bootcamp", "name description");
    }

    const courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });

});

// @desc create course
// @route POST /api/v1/courses
// @access private
export const createCourse = catchAsync(async (req, res, next) => {
    const course = await Course.create(req.body);
    res.status(201).json({
        success: true,
        data: course
    });
});
//desc update course
// @route PUT /api/v1/courses/:id
// @access private

// desc Get single course
// @route GET /api/v1/courses/:id
// @access Public
export const getCourse = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ success: false, message: "Course not founded" });
    }
    res.status(200).json({
        success: true,
        data: course
    });
});
// desc update course
// @route PUT /api/v1/courses/:id
// @access private
export const updateCourse = catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ success: false, message: "Course not founded" });
    }
    // owner or admin only can update the course
    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "You are not authorized to update this course" });
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
        success: true,
        data: course
    })
})
// desc delete course
// @route DELETE /api/v1/courses/:id
// @access private
export const deleteCourse = catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ success: false, message: "Course not founded" });
    }
    // owner or admin only can delete the course
    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this course" });
    }
    await course.deleteOne();
    res.status(200).json({
        success: true,
        data: {}
    })
});

