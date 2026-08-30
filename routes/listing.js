const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../Models/listing.js");
const { exists } = require("../Models/reviews.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");




// INDEX wala route 
// GET /listings
router.get(
  "/",
  WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);


// NEW - just the request to create a new route(CREATE)
// GET /listings/new
router.get("/new", isLoggedIn, (req, res) => {

  let listing = new Listing();
  res.render("./listings/new.ejs", { listing });
});


// SHOW - to see a listing(Read)
// GET /listings/:id
router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({
      path : "reviews",
    populate: {
      path : "author",
    }}).populate("owner");

    if(!listing){
       req.flash("error", "Listing you requested for, does not exists.");
      return res.redirect("/listings");
    }
    console.log("LISTING:", listing);
    console.log("PRICE:", listing.price);

    res.render("./listings/show.ejs", { listing });
  })
);


// CREATE - new post create krne ke liye
// POST /listings
router.post(
  "/", isLoggedIn,
  validateListing,
  WrapAsync(async (req, res) => {

    if (!req.body.listing) {
      throw new ExpressError(400, "Please enter valid data for listing");
    }

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    
    await newListing.save();

    req.flash("success", "New Listing Created!")

    console.log(newListing);

    res.redirect("/listings");
  })
);


// EDIT - to edit  a particular listing
// GET /listings/:id/edit
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  WrapAsync(async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

     if(!listing){
       req.flash("error", "Listing you requested for, does not exists.");
      return res.redirect("/listings");
     }

    res.render("./listings/edit.ejs", { listing });
  })
);


// UPDATE isme put krenge
// PUT /listings/:id
router.put(
  "/:id", isLoggedIn, isOwner,
  WrapAsync(async (req, res) => {

    let { id } = req.params;

    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing }
    );

     req.flash("success", "Listing Updated!!");

    res.redirect(`/listings/${id}`);
  })
);


// DELETE this will delete  a listing
// DELETE /listings/:id
router.delete(
  "/:id", isLoggedIn, isOwner,
  WrapAsync(async (req, res) => {

    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);

    console.log(`deleted listing is ${deletedListing}`);

    req.flash("success", "Listing deleted!!");

    res.redirect("/listings");
  })
);


module.exports = router;