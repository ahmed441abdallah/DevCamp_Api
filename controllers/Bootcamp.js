
import mongoose from "mongoose";
import BootCamp from "../models/Bootcamp.js";
import { catchAsync } from "../utils/catchAsync.js";
import geocoder from "../utils/geocoder.js";
import { validateBootcamp, validateUpdateBootcamp } from "../validations/schemas/bootcamp.schema.js";
import path from "path";
import { fileURLToPath } from "url";
import Course from "../models/Course.js";
import Review from "../models/Review.js";
import Enrollment from "../models/Enrollment.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// desc GET all bootcamps
// @route GET /api/v1/bootcamps
// @public
const getBootcamps = catchAsync(async (req, res) => {
    res.status(200).json(res.advancedResults);
});
// desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @public
const getBootcamp = catchAsync(async (req, res) => {
    const bootcamp = await BootCamp.findById(req.params.id).populate("courses", "title description cost").populate("user", "name email");
    if (!bootcamp) {
        return res.status(404).json({ success: false, message: "Bootcamp not founded" })
    }
    res.status(200).json({ success: true, date: bootcamp })
});
// desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @public
const createBootcamp = catchAsync(async (req, res) => {
    //1. validations
    const { error } = validateBootcamp(req.body);
    // 2. If error exists, return a 400 response with the error messages
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ success: false, errors: errorMessages });
    }
    // prevent publisher from creating more than one bootcamp
    const publisherBootcamps = await BootCamp.find({ user: req.user.id });
    if (req.user.role !== "admin" && publisherBootcamps.length >= 1) {
        return res.status(403).json({ success: false, message: `The ${req.user.role} can only create one bootcamp` });
    }
    // 3. If validation passes, create the bootcamp in the database
    const bootCamp = await BootCamp.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: bootCamp });

});
// desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @public
const updateBootcamp = catchAsync(async (req, res) => {
    const { error } = validateUpdateBootcamp(req.body);
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ success: false, errors: errorMessages });
    }
    // owner or admin only can update the bootcamp
    let bootcamp = await BootCamp.findById(req.params.id);
    if (!bootcamp) {
        return res.status(400).json({ success: false, message: "Bootcamp not founded" })
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "You are not authorized to update this bootcamp" });
    }
    bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({ succes: true, data: bootcamp })

});
// desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @public
const deleteBootcamp = catchAsync(async (req, res) => {
    const bootCamp = await BootCamp.findById(req.params.id)
    if (!bootCamp) {
        return res.status(404).json({ success: false, message: "Bootcamp not founded" })
    }
    // owner or admin only can delete the bootcamp
    if (bootCamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this bootcamp" });
    }
    await bootCamp.deleteOne();
    res.status(200).json({ success: true, data: {} })
});
const getBootcampsInRadius = catchAsync(async (req, res) => {
    const { zip, distance } = req.params;
    const location = await geocoder.geocode(zip);
    const lat = location[0].latitude;
    const lng = location[0].longitude;
    const bootcamps = await BootCamp.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: distance * 1609.34
            }
        }
    });
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});
// desc Upload photo for a bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access private
export const uploadPhoto = catchAsync(async (req, res) => {
    const bootcamp = await BootCamp.findById(req.params.id);
    if (!bootcamp) {
        return res.status(404).json({ success: false, message: "Bootcamp not founded" });
    }
    if (!req.files) {
        return res.status(400).json({ success: false, message: "Please upload a photo" });
    }
    const photo = req.files.photo;
    // Check file type
    if (!photo.mimetype.startsWith("image")) {
        return res.status(400).json({ success: false, message: "Please upload an image" });
    }
    // Check file size
    if (photo.size > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: "Photo must be less than 5MB" });
    }
    const uploadPath = path.join(__dirname, "..", "public", "uploads", photo.name);
    photo.mv(uploadPath, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error uploading file" });
        }
        await BootCamp.findByIdAndUpdate(req.params.id, { photo: photo.name });
        res.status(200).json({ success: true, data: photo.name })
    })
});
// desc Get Bootcamp Statistics
// @route GET /api/v1/bootcamps/:id/statistics
// @access public
const getBootcampStatistics = catchAsync(async (req, res) => {
    const bootcampId = new mongoose.Types.ObjectId(req.params.id);
    // 1. Make sure the bootcamp exists
    const bootcamp = await BootCamp.findById(bootcampId);
    if (!bootcamp) {
        return res.status(404).json({ success: false, message: "Bootcamp not found" });
    }

    const [totalStudents, pendingEnrollments, totalCourses] = await Promise.all([
        Enrollment.countDocuments({ bootcamp: bootcampId, status: "approved" }),
        Enrollment.countDocuments({ bootcamp: bootcampId, status: "pending" }),
        Course.countDocuments({ bootcamp: bootcampId }),
    ]);
    res.status(200).json({
        success: true,
        data: {
            bootcamp: {
                _id: bootcamp._id,
                name: bootcamp.name
            },
            totalStudents,
            pendingEnrollments,
            totalCourses,
        }
    });
});

export { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, getBootcampStatistics };