import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/User.js";
import matchPassword from "../utils/matchPassword.js";
import { validateLoginUser, validateRegisterUser } from "../validations/schemas/user.schema.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
// desc Register user
// @route POST /api/v1/auth/register
// @access public
export const register = catchAsync(async (req, res) => {
    const { name, email, password, role } = req.body;
    // validate user
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ success: false, error: error.details[0].message });
    }
    // Check if user already exists
    const user = await User.findOne({ email: email });
    if (user) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }
    // create user
    const newUser = await User.create({ name, email, password, role });
    sendTokenResponse(newUser, 201, res);
});
// desc Login user
// @route POST /api/v1/auth/login
// @access public
export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    // validate user
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ success: false, error: error.details[0].message });
    }
    // Must use .select('+password') because password has select:false in schema
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    // Check password
    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    sendTokenResponse(user, 200, res);

});
// desc Get Logged in User
// @route GET /api/v1/auth/me
// @access Private
export const getMe = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
});
// desc Logout user
// @route POST /api/v1/auth/logout
// @access Private
export const logout = catchAsync(async (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, data: {} });
});
// desc Forgot password
// @route POST /api/v1/auth/forgotpassword
// @access public
export const forgotPassword = catchAsync(async (req, res) => {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    // generate token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // send token to user
    try {
        await sendEmail({
            email: user.email,
            subject: "Forgot Password",
            text: `Your reset password token is: ${resetToken}`,
        });
        res.status(200).json({ success: true, message: "Email sent" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }

});
// desc reset password
// @route PUT /api/v1/auth/reset-password/:resettoken
// @access public
export const resetPassword = catchAsync(async (req, res) => {
    // get token url from params and compare with token in db
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    // find user with token and not expired
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }, // valid token
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
    // update password with new password
    user.password = req.body.password;
    // clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});
export const updatePassword = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const isMatch = await matchPassword(req.body.currentPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
});