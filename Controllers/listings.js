const Listing = require("../Models/listing.js");



// INDEX wala route  - all listings wala page 
// GET /listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }



// NEW - just the request to create a new route(CREATE) - yha se new wala from render hoga 
// GET /listings/new

  module.exports.renderNewForm = (req, res) => {

  let listing = new Listing();
  res.render("./listings/new.ejs", { listing });
}



// SHOW - to see a listing(Read)
// GET /listings/:id - id for identifying which particular
module.exports.showListing = async (req, res) => {
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
  }




// CREATE - new listing post create krne ke liye
// POST /listings
  module.exports.postListing = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    if (!req.body.listing) {
      throw new ExpressError(400, "Please enter valid data for listing");
    }

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    
    newListing.image = {url, filename};

    await newListing.save();

    req.flash("success", "New Listing Created!")

    console.log(newListing);

    res.redirect("/listings");
  }




// EDIT - to edit  a particular listing
// GET /listings/:id/edit
module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for, does not exists.");
        return res.redirect("/listings");
    }

    res.render("./listings/edit.ejs", { listing });
};

  // UPDATE isme put krenge
// PUT /listings/:id
module.exports.updateListing = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for, does not exist.");
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated!!");

    res.redirect(`/listings/${id}`);
};


// DELETE this will delete  a listing
// DELETE /listings/:id

  module.exports.deleteListing = async (req, res) => {

    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);

    console.log(`deleted listing is ${deletedListing}`);

    req.flash("success", "Listing deleted!!");

    res.redirect("/listings");
  }