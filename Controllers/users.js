const User = require("../Models/user.js");

//render signup form
module.exports.renderSignUpForm = (req, res) =>{
  res.render("./users/signup.ejs");
}


//route to signup
module.exports.signUp = async (req, res) => {
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
    }


//render login form 
    module.exports.renderLoginForm = (req, res)=>{
res.render("users/login.ejs");
}
    


// route to login
module.exports.login = async(req,res)=>{
  req.flash("success", "welcome back to WanderLust, you are successfully logged in!!");
res.redirect(res.locals.redirectUrl || "/listings");
}


//logout route
module.exports.logout = (req,res)=>{
  req.logout((err) =>{
    if(err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
}