import Wishlist from "../models/Wishlist.js";
import { catchAsync } from "../utils/catchAsync.js";

// @desc add bootcamp to wishlist
// @route POST /api/v1/wishlist/:bootcampId
// @access Private
export const addToWishlist = catchAsync(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        // user has no wishlist yet — create one
        const newWishlist = await Wishlist.create({
            user: req.user.id,
            bootcamps: [req.params.bootcampId]
        });
        return res.status(201).json({ success: true, data: newWishlist });
    }

    // check if bootcamp already exists in THIS user's wishlist
    const alreadyExists = wishlist.bootcamps.some(
        id => id.toString() === req.params.bootcampId
    );

    if (alreadyExists) {
        return res.status(400).json({ success: false, message: "Bootcamp already exists in wishlist" });
    }

    // add the bootcampId to the array
    wishlist.bootcamps.push(req.params.bootcampId);
    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
});
// @desc get user wishlist
// @route GET /api/v1/wishlist
// @access Private
export const getWishlist = catchAsync(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate("bootcamps", 'name description cost photo averageRating');
    res.status(200).json({ success: true, data: wishlist });
});
// @desc remove bootcamp from wishlist
// @route DELETE /api/v1/wishlist/:bootcampId
// @access Private
export const removeFromWishlist = catchAsync(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
        return res.status(404).json({ success: false, message: "Wishlist not found" });
    }
    const bootcampIndex = wishlist.bootcamps.findIndex(
        id => id.toString() === req.params.bootcampId
    );
    if (bootcampIndex === -1) {
        return res.status(404).json({ success: false, message: "Bootcamp not found in wishlist" });
    }
    wishlist.bootcamps.splice(bootcampIndex, 1);
    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });

    /*
    bootcamps.filter(id=> id.toString()!==req.params.bootcampId);
    */
});
// @desc clear wishlist
// @route DELETE /api/v1/wishlist
// @access Private
export const clearWishlist = catchAsync(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
        return res.status(404).json({ success: false, message: "Wishlist not found" });
    }
    wishlist.bootcamps = [];
    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
});
