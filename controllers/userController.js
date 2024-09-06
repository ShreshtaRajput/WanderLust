const User = require("../models/users");

// SignUp form
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

// SignUp
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Login form
module.exports.renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

// Login
module.exports.login = async (req, res) => {
  req.flash("success", "You are logged in");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out");
    res.redirect("/listings");
  });
};
