const express = require("express");

// MIDDLEWARE
const {
  isLoggedIn,
  isAlreadyLoggedIn,
} = require("../middlewares/authMiddleware");
const { uploadImg } = require("../middlewares/uploadImg");
// END MIDDLEWARE

const { authRegister, authLogin } = require("../controllers/Auth");
const {
  renderHome,
  renderContact,
  render404,
} = require("../controllers/HomeContactController");


const { renderTestimonial,filterByRating } = require("../controllers/TestimoniController");


const {
  renderBlog,
  deleteBlog,
  addBlog,
  renderaddBlog,
  rendereditBlog,
  editBlog,
  searchBlog,
  renderDetailBlog,
} = require("../controllers/BlogController");

const {
  renderProject,
  renderAddProject,
  renderEditProject,
  getProjects,
  getProjectDetails,
  addProject,
  deleteProject,
  searchProject,
  editProject,
} = require("../controllers/ProjectController");

const router = express.Router();


router.get("/", renderHome);
router.get("/Home", renderHome);

// Home Contact Testimoni
router.get("/contact", renderContact);
router.get("/testimonial", renderTestimonial);
// END Home Contact Testimoni

// BLOG
router.get("/blog", renderBlog);
router.get("/addblog", renderaddBlog);
router.get("/editblog/:id", rendereditBlog);
router.post("/addBlog", uploadImg.single("image"), addBlog);
router.post("/editblog/:id", uploadImg.single("image"), editBlog);
router.get("/searchblog", searchBlog);
router.get("/detailblog/:title", renderDetailBlog);
router.delete("/deleteblog/:id", isLoggedIn, deleteBlog);
// END BLOG

// PROJECT
router.get("/project", renderProject);
router.get("/addproject", isLoggedIn, renderAddProject);
router.get("/api/projects", getProjects);
router.post("/addproject", uploadImg.single("image"), addProject);
router.get("/project/:title", getProjectDetails);
router.get(
  "/editproject/:id",
  isLoggedIn,
  uploadImg.single("image"),
  renderEditProject
);
router.post("/editproject/:id", uploadImg.single("image"), editProject);
router.get("/searchproject", searchProject);
router.delete("/deleteproject/:id", isLoggedIn, deleteProject);
// END PROJECT
router.get("/testimonials/rating/:rating", filterByRating);


router.get("/login", isAlreadyLoggedIn, (req, res) =>
  res.render("../views/partials/login")
);
router.get("/register", isAlreadyLoggedIn, (req, res) =>
  res.render("../views/partials/register")
);
router.post("/register", isAlreadyLoggedIn, authRegister);
router.post("/login", isAlreadyLoggedIn, authLogin);


router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Gagal logout");
    }
    res.redirect("/login");
  });
});

router.use("*", render404);

module.exports = router;
