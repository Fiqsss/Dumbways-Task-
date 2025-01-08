exports.renderHome = (req, res) => {
  const user = req.session.user;
  console.log(user);
  res.render("home", {
    user: user,
    actived: "home",
    title: "Home | Dumbways Task",
  });
};

exports.renderContact = (req, res) => {
  res.render("contact", {
    actived: "contact",
    title: "Contact | Dumbways Task",
    user: req.session.user,
  });
};



exports.render404 = (req, res) => {
  const code = 404;

  const codeArray = [code];

  console.log(codeArray);

  res
    .status(200)
    .render("partials/404", { codeArray, message: "Halaman tidak ditemukan" });
};
