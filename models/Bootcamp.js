import mongoose from "mongoose";
import slugify from "slugify";
import geocoder from "../utils/geocoder.js";

const bootCampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Bootcamp name is required"],
        unique: true,
        maxLength: [50, "Bootcamp name cannot be more than 50 characters"]

    },
    slug: String,
    description: {
        type: String,
        required: [true, "Bootcamp description is required"],
        maxLength: [200, "Bootcamp description cannot be more than 200 characters"]
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please use a valid URL with HTTP or HTTPS"
        ]
    },
    address: {
        type: String,
        required: [true, "Bootcamp address is required"]
    },
    caarers: {
        type: [String],
        required: true,
        enum: ["Web Development", "Mobile Development", "UI/UX", "Data Science", "Business", "Other"]
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must can not be more than 10"]
    },
    cost: Number,
    photo: String,
    phone: String,
    housing: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
        formattedAddress: String,
        street: String,
        city: String,
        zipcode: String,
        country: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// create slugify
bootCampSchema.pre("save", function () {
    this.slug = slugify(this.name, { lower: true });
});

// Geocode & create location field
bootCampSchema.pre('save', async function () {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].state,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    };

    // Do not save address in DB
    this.address = undefined;
});
bootCampSchema.index({ location: '2dsphere' });
// Virtual field to get courses in a bootcamp
bootCampSchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "bootcamp",
    justOne: false
})
// virtual field to get reviews in a bootcamp
bootCampSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "bootcamp",
    justOne: false
})
// cascade delete reviews and courses when a bootcamp is deleted
bootCampSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    console.log(`Deleting bootcamp ${this._id}`);
    await this.model('Review').deleteMany({ bootcamp: this._id });
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
});
const BootCamp = mongoose.model("BootCamp", bootCampSchema);
export default BootCamp;