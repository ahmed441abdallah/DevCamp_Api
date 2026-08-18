import Review from "../models/Review.js";
import { catchAsync } from "../utils/catchAsync.js"
// @desc get all reviews
// @route GET /api/v1/reviews
// @public
export const getReviews = catchAsync(async (req, res) => {
    res.status(200).json(res.advancedResults);

})
// @desc create review 
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @private
export const createReview = catchAsync(async (req, res) => {
    const { bootcampId } = req.params;
    const { title, text, rating } = req.body;

    const review = await Review.create({
        title,
        text,
        rating,
        bootcamp: bootcampId,
        user: req.user.id
    });
    res.status(201).json({ success: true, data: review });

})
// @desc get single review
// @route GET /api/v1/reviews/:id
// @private
export const getReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    res.status(200).json({ success: true, data: review });

})
// @desc update review
// @route PUT /api/v1/reviews/:id
// @private
export const updateReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: review });

})
// @desc delete review
// @route DELETE /api/v1/reviews/:id
// @private
export const deleteReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    //check if user is owner of the review
    const review = await Review.findById(id);
    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }
    // check if user is owner or admin
    if (review.user.toString() !== req.user.id || req.user.role !== "admin") {
        return res.status(401).json({ success: false, message: "Not authorized to delete this review" });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });

})