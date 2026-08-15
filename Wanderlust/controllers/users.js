const User = require("../models/user.js");

// render sign up form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// signup- post req
module.exports.signup = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User registration successful!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

//render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  // console.log(req.user);
  req.flash("success", "User login successful!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  // console.log(redirectUrl);
  res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // console.log(req.user);
    req.flash("success", "Log out successful!");
    res.redirect("/listings");
  });
};
