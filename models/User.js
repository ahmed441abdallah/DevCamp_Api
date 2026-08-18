import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        maxLength: [50, "User name cannot be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please add a valid email'
        ]

    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },

    role: {
        type: String,
        enum: ["user", "publisher"],
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, {
    timestamps: true,
});
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;  // remove password from response
    return obj;
};
// Hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.getResetPasswordToken = function () {
    // Generate a crypto random string
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Hash the crypto random string
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // Set expire time to 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
const User = mongoose.model("User", userSchema);
export default User;