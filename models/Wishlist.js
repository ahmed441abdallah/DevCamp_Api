import mongoose from "mongoose"

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    bootcamps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BootCamp",
            unique: true,
            required: [true, "Bootcamp is required"]
        }
    ]
})
// no virtual needed — bootcamps is a real array of ObjectIds, just use .populate() in queries
const Wishlist = mongoose.model("Wishlist", WishlistSchema)
export default Wishlist