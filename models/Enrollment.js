import mongoose from "mongoose";
const EnrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BootCamp",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });
// Prevent user from enrolling in the same bootcamp more than once
EnrollmentSchema.index({ user: 1, bootcamp: 1 }, { unique: true });
const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;