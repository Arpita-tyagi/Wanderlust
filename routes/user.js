const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");

const passport = require("passport");
const {saveRedirectUrl}= require("../middlewares.js");
const  ControllerUser  = require("../Controllers/users.js");

//route for common path signup
router.route("/signup")
.get( ControllerUser.renderSignUpForm) //render signup form
.post(WrapAsync(ControllerUser.signUp)) //route to signup


//common route path for login 
router.route("/login")
.get(ControllerUser.renderLoginForm)  //render login form 
.post( saveRedirectUrl,
  passport.authenticate("local", {failureRedirect: "/login", failureFlash : true}), 
  ControllerUser.login);  // route to login


//logout route
router.get("/logout", ControllerUser.logout);


module.exports = router;
