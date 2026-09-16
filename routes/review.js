const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");
const controllerReview = require("../Controllers/reviews.js");


// CREATE REVIEW
// POST /listings/:id/reviews
router.post("/", isLoggedIn, validateReview, WrapAsync(controllerReview.createReview));


// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
router.delete("/:reviewId", isReviewAuthor, WrapAsync(controllerReview.deleteReviews)
);


module.exports = router;