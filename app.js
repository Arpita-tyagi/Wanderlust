const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";


// MongoDB connection(basic code for connection)
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


// EJS  (isse html css or sari boilerplate cheeze ho jayegi)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middlewares(important between sending and responding a request)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));


// using sessions and flashes 

const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUnintialized: true,
  cookie: {
    expires : Date.now() + 7* 24 * 60 * 60 * 1000,
    maxAge : 7* 24 * 60 * 60 * 1000,
    httpOnly: true,
  },

};

app.use(session(sessionOptions));
app.use(flash());


//passport - authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// demo user 
app.get("/demouser", async(req, res)=>{
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "Arpita tyagi"
  });

  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

app.use("/", userRouter);

// Home route
app.get("/", (req, res) => {
  res.send("say hello to new beginning!!");
});


// Routes (listing ki requests alg folder mein or review ki alg rather all beign here )
app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);


// Error handling for routes that don't exist
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});


// middleware to handle error
app.use((err, req, res, next) => {
  let {
    statusCode = 500,
    message = "page does not exists"
  } = err;

  res.status(statusCode).render("error.ejs", { message });
});


// sign that  Server has started
const port = 8080;

app.listen(port, () => {
  console.log(`${port} is listening...`);
});