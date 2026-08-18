import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/User.js";
// desc Get all users
// @route GET /api/v1/users
// @access private Admin only
export const getUsers = catchAsync(async (req, res) => {
    res.status(200).json(res.advancedResults);
})
// desc Get single user
// @route GET /api/v1/users/:id
// @access private Admin only
export const getUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not founded" });
    }
    res.status(200).json({
        success: true,
        data: user
    });
});
// desc Create user
// @route POST /api/v1/users
// @access private Admin only
export const createUser = catchAsync(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
});
// desc Update user
// @route PUT /api/v1/users/:id
// @access private Admin only
export const updateUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not founded" });
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
        success: true,
        data: user
    });
});
// desc Delete user
// @route DELETE /api/v1/users/:id
// @access private Admin only
export const deleteUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not founded" });
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        data: {}
    });
}); 