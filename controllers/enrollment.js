import { catchAsync } from "../utils/catchAsync.js";
import Enrollment from "../models/Enrollment.js";
// desc Get all enrollments
// @route GET /api/v1/enrollments
// @access private
export const getEnrollments = catchAsync(async (req, res) => {
    let query;
    if (req.params.bootcampId) {
        query = Enrollment.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Enrollment.find();
    }

    const enrollments = await query;
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
});
// desc Get single enrollment
// @route GET /api/v1/enrollments/:id
// @access private
export const getEnrollment = catchAsync(async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
        return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, data: enrollment });
});
// desc Create enrollment
// @route POST /api/v1/enrollments/:bootcampId
// @access private
export const createEnrollment = catchAsync(async (req, res) => {
    const enrollment = await Enrollment.create({ user: req.user.id, bootcamp: req.params.bootcampId });
    res.status(201).json({ success: true, data: enrollment });
});
// desc reject enrollment
// @route PUT /api/v1/enrollments/:id/reject
// @access private
export const rejectEnrollment = catchAsync(async (req, res) => {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true, runValidators: true });
    if (!enrollment) {
        return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, data: enrollment });
});
// desc approve enrollment
// @route PUT /api/v1/enrollments/:id/approve
// @access private
export const approveEnrollment = catchAsync(async (req, res) => {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true, runValidators: true });
    if (!enrollment) {
        return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, data: enrollment });
});

// desc get current user enrollments
// @route GET /api/v1/enrollments/me
// @access private
export const getCurrentUserEnrollments = catchAsync(async (req, res) => {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate("bootcamp");
    res.status(200).json({ success: true, data: enrollments });
});
