import mongoose from "mongoose";
import BootCamp from "./Bootcamp.js";
const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 6,
        required: true,
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BootCamp",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

// Prevent users from reviewing the same bootcamp more than once
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
// statics method to calcualte avg rating
reviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRating: { $avg: "$rating" }
            }
        }
    ]);
    try {
        await BootCamp.findByIdAndUpdate(bootcampId, {
            averageRating: obj[0] ? Math.ceil(obj[0].averageRating) : 0
        });
    } catch (err) {
        console.error(err);
    }
}
// call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
})
// call getAverageRating before delete
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
    this.constructor.getAverageRating(this.bootcamp);
})
// Cascade delete reviews when a bootcamp is deleted
reviewSchema.pre('remove', async function (next) {
    await this.model('BootCamp').updateOne({ _id: this.bootcamp }, { $pull: { reviews: this._id } });
    next();
});

export default mongoose.model("Review", reviewSchema);
