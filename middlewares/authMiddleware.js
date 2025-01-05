function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.flash("error", "Please log in to access this page.");
    return res.redirect("/login");
  }
}

function isAlreadyLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/');  
  }
  next();
}

module.exports = {
  isLoggedIn,
  isAlreadyLoggedIn,
};