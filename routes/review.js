const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");


// CREATE REVIEW
// POST /listings/:id/reviews
router.post(
  "/", isLoggedIn,

  validateReview,

  WrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();

    await listing.save();

     req.flash("success", "Review added!!");

    console.log("new review saved!!");

    res.redirect(`/listings/${listing.id}`);
  })
);


// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
router.delete(
  "/:reviewId", isReviewAuthor,

  WrapAsync(async (req, res) => {

    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(
      id,
      {
        $pull: {
          reviews: reviewId
        }
      }
    );

    await Review.findByIdAndDelete(reviewId);

     req.flash("success", "Review deleted!!");

    res.redirect(`/listings/${id}`);
  })
);


module.exports = router;