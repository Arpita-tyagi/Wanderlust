const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const User = require("../Models/user.js");
const passport = require("passport");
const {saveRedirectUrl}= require("../middlewares.js");

router.get("/signup", (req, res) =>{
  res.render("./users/signup.ejs");
});
//route to signup
router.post("/signup", WrapAsync(async (req, res) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            //to auto login after signup
            req.login(registeredUser, (err)=>{
              if(err){
                return next(err);
              }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
            });


           
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    })
);

// route to login
router.get("/login", (req, res)=>{
res.render("users/login.ejs");

});
router.post("/login",
  saveRedirectUrl,
   passport.authenticate("local", {failureRedirect: "/login", failureFlash : true}),
    async(req,res)=>{
  req.flash("success", "welcome back to WanderLust, you are successfully logged in!!");
res.redirect(res.locals.redirectUrl || "/listings");
});

//logout route
router.get("/logout", (req,res)=>{
  req.logout((err) =>{
    if(err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
});


module.exports = router;
