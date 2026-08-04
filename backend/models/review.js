const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        movieTitle: {
            type: String,
            required: true,
            trim: true
        },

        poster: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        opinion: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Review", reviewSchema);