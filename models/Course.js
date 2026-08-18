import mongoose from "mongoose";
import BootCamp from "./Bootcamp.js";
const courseShema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add title"]
    },
    description: {
        type: String,
        required: [true, "Please add description"]
    },
    weeks: {
        type: String,
        required: [true, "Please add number of weeks"]
    },
    cost: {
        type: Number,
        required: [true, "Please add cost"]
    },
    minimumSkill: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"]
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BootCamp",
        required: [true, "Please add bootcamp"]
    }
}, { timestamps: true });
// static method to get average cost
courseShema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: { $avg: "$cost" }
            }
        }
    ]);
    try {
        await BootCamp.findByIdAndUpdate(bootcampId, {
            cost: obj[0] ? Math.ceil(obj[0].averageCost) : 0
        });
    } catch (err) {
        console.error(err);
    }
}
// call getAverageCost after save
courseShema.post("save", function () {
    this.constructor.getAverageCost(this.bootcamp);
})
// call getAverageCost before delete
courseShema.post("deleteOne", { document: true, query: false }, function () {
    this.constructor.getAverageCost(this.bootcamp);
})

// ✅ Model must be compiled AFTER all statics and hooks are defined
const Course = mongoose.model("Course", courseShema);
export default Course;