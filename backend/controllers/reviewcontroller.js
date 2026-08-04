const Review = require("../models/Review");


// ================================
// CREATE REVIEW
// ================================

const createReview = async (req, res) => {
    try {
        const {
            movieTitle,
            poster,
            rating,
            opinion
        } = req.body;

        if (!movieTitle || !rating || !opinion) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        const review = await Review.create({
            movieTitle,

            poster:
                poster && poster !== "N/A"
                    ? poster
                    : "",

            rating,
            opinion,

            username: req.user.username,
            userId: req.user.userId
        });

        res.status(201).json({
            message: "Review created successfully!",
            review
        });

    } catch (error) {
        console.error(
            "Create review error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while creating review."
        });
    }
};


// ================================
// GET ALL REVIEWS
// ================================

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({
                createdAt: -1
            });

        res.status(200).json(
            reviews
        );

    } catch (error) {
        console.error(
            "Get reviews error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while getting reviews."
        });
    }
};


// ================================
// UPDATE REVIEW
// ================================

const updateReview = async (req, res) => {
    try {
        const review =
            await Review.findById(
                req.params.id
            );

        if (!review) {
            return res.status(404).json({
                message: "Review not found."
            });
        }

        if (
            review.userId.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only edit your own reviews."
            });
        }

        const {
            rating,
            opinion
        } = req.body;

        if (!rating || !opinion) {
            return res.status(400).json({
                message:
                    "Rating and opinion are required."
            });
        }

        review.rating = rating;
        review.opinion = opinion;

        await review.save();

        res.status(200).json({
            message:
                "Review updated successfully!",
            review
        });

    } catch (error) {
        console.error(
            "Update review error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while updating review."
        });
    }
};


// ================================
// DELETE REVIEW
// ================================

const deleteReview = async (req, res) => {
    try {
        const review =
            await Review.findById(
                req.params.id
            );

        if (!review) {
            return res.status(404).json({
                message: "Review not found."
            });
        }

        if (
            review.userId.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only delete your own reviews."
            });
        }

        await Review.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message:
                "Review deleted successfully!"
        });

    } catch (error) {
        console.error(
            "Delete review error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while deleting review."
        });
    }
};


module.exports = {
    createReview,
    getReviews,
    updateReview,
    deleteReview
};