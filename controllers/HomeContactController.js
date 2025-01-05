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

// exports.getTestimonials = async (req, res) => {
//   try {
//     // const result = await pool.query("SELECT * FROM testimonial");
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// };

exports.renderTestimonial = (req, res) => {
  res.render("testimonial", {
    actived: "testimonial",
    title: "Testimonial | Dumbways Task",
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
