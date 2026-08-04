const express = require("express");

const router = express.Router();

const {
    createReview,
    getReviews,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");


router.get(
    "/",
    getReviews
);

router.post(
    "/",
    protect,
    createReview
);

router.put(
    "/:id",
    protect,
    updateReview
);

router.delete(
    "/:id",
    protect,
    deleteReview
);


module.exports = router;