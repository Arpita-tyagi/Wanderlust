const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../Models/listing.js");
const { exists } = require("../Models/reviews.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const controllerListings = require("../Controllers/listings.js");

router.route("/")                                  //this is the common path for index and create


.get( WrapAsync(controllerListings.index))         //INDEX wala route  - all listings wala page

 .post( 
  isLoggedIn,
  upload.single("image"),
  validateListing,
 WrapAsync(controllerListings.postListing));   // CREATE - new listing post create krne ke liye   // POST /listings



// NEW - just the request to create a new route(CREATE) - yha se new wala from render hoga 
// GET /listings/new
router.get("/new", isLoggedIn, controllerListings.renderNewForm);




//for all the reuests with common route /:id
router.route("/:id")
.get(WrapAsync(controllerListings.showListing))  // SHOW - to see a listing(Read)// GET /listings/:id - id for identifying which particular

.put(                                                 // UPDATE isme put kreng  // PUT /listings/:id
  isLoggedIn, 
  isOwner,
  upload.single("image"),
  validateListing,
  WrapAsync(controllerListings.updateListing))


.delete(                                                    // UPDATE isme put kreng  // PUT /listings/:id
  isLoggedIn, 
  isOwner,
  WrapAsync(controllerListings.deleteListing))




  
// EDIT - to edit  a particular listing
// GET /listings/:id/edit
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  WrapAsync(controllerListings.renderEditForm)
);



module.exports = router;