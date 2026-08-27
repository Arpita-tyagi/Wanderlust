const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const WrapAsync = require("./utils/WrapAsync.js");
const {listingSchema } = require("./schema.js");


main()
.then
(() => { 
  console.log("connected to DB");
})
.catch((err)=>{
console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
const port = 8080;
app.listen(port, (req, res)=>{
  console.log(`${port} is listining...`);
});


app.get("/", (req,res)=>{
  res.send("say hello to new begning!!");
});

const validateListing = (req, res, next) =>
{
let { error } = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)  => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
else{
next();
}
}

// index wala route - sari listings (main request jo ayegi) -------read api/operation
app.get("/listings" , WrapAsync(async (req, res)=>{
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", {allListings});
}));

//new route  -  for creation of new listing -------- create api/opertaion(just new listing ki details enter krne wala form khulega)
app.get("/listings/new", (req, res) => {
    let listing = new Listing();
    res.render("./listings/new.ejs", { listing });
});

// show route -  agr ek particular listing ki details dekne ke  liye  ---- read api/operation
app.get("/listings/:id" ,  WrapAsync(async(req, res) =>{
let {id} = req.params;
const listing = await Listing.findById(id);
    console.log("LISTING:", listing);
    console.log("PRICE:", listing.price);
res.render("./listings/show.ejs", {listing} );
}));


// Create request (new listing ki details save ho jayegi ) - Post
app.post("/listings", WrapAsync( async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    if(!req.body.listing){
     throw new ExpressError(400, "please enter valid data for listing");
    }
  await newListing.save();
  console.log(newListing);
  res.redirect("/listings");

  }));

//Edit route(edit krne form khulega)
app.get("/listings/:id/edit",  WrapAsync(async (req, res)=>{
let {id} = req.params;
const listing = await Listing.findById(id);
res.render("./listings/edit.ejs", {listing});
}));

//update route - put (isse edited wali save ho jaeygi)
app.put("/listings/:id",  WrapAsync(async(req,res)=>{
  let {id} = req.params;
 await Listing.findByIdAndUpdate(id, {...req.body.listing});
 res.redirect(`/listings/${id}`);
}));

//delte a listing - delete
app.delete("/listings/:id", WrapAsync( async(req,res)=>{
  let {id} = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(`delted listing is ${deletedlisting}`);
  res.redirect("/listings");
}));
//handling errors like if someone wants to go for a route that doesn't exist 
app.use(( req, res, next)=>{  // agr route match ho jata hai upr ke routes se toh ye run nhi krega agr koi route pr nhi jayega toh ispr jayega
next(new ExpressError(404, "page not found!"))
});

app.use((err, req, res, next)=>{
  let {statusCode=500, message="PAGE DOES NOT EXISTS"} = err; // 500 and page does not exist are default values if no value is provided
  res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
});
// app.get("/testlisting", async (req, res)=>{
// const sampleList = new Listing({
// title : "My New Villa",
// description : "By The Beach",
// price: 1200,
// location: "calangaute Goa",
// country : "India"
//   });
//   await sampleList.save();
//   console.log("sample was saved!");
//   res.send("successful testing");
// });
