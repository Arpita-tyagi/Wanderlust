const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title : {
    type: String,
    required : true,
  }, 
  description : String,
  image :{
    type: String,
    set : (v) =>
      (v === "" ) ? "https://unsplash.com/photos/white-and-brown-concrete-building-under-blue-sky-during-daytime-_TPTXZd9mOo" :  v , 
    },
  price : Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing; 
