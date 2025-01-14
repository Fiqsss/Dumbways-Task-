function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.session.flash = {
      message: "Please log in to access this page.",
      type: "error",
    };
    return res.redirect("/login");
  }
}

function isAlreadyLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect("/");
  }
  next();
}

module.exports = {
  isLoggedIn,
  isAlreadyLoggedIn,
};
