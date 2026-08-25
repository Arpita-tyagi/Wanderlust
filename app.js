const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const Listing = require("./Models/listing.js");

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




const port = 8080;
app.listen(port, (req, res)=>{
  console.log(`${port} is listining`);
});


app.get("/", (req,res)=>{
  res.send("say hello to new begning!!");
});
app.get("/testlisting", async (req, res)=>{
const sampleList = new Listing({
title : "My New Villa",
description : "By The Beach",
price: 1200,
location: "calangaute Goa",
country : "India"
  });
  await sampleList.save();
  console.log("sample was saved!");
  res.send("successful testing");
});
