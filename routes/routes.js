const express = require("express");
const {
  renderHome,
  renderBlog,
  renderContact,
  renderTestimonial,
  getTestimonials,
  render404,
  deleteBlog,
  addBlog,
  renderaddBlog,
  rendereditBlog,
  editBlog,
  searchBlog
} = require("../controllers/BlogController");

const {
  renderProject,
  renderAddProject,
  getProjects,
  getProjectDetails,
  addProject,
} = require("../controllers/ProjectController");

const router = express.Router();

router.get("/", renderHome);

// BLOG
router.get("/blog", renderBlog);
router.get("/addblog", renderaddBlog);
router.delete("/deleteblog/:id", deleteBlog);
router.get("/editblogpage/:index", rendereditBlog);
router.post("/addBlog", addBlog);
router.post("/editblog/:id", editBlog);
router.get("/searchblog", searchBlog);
// END BLOG

// PROJECT
router.get("/project", renderProject);
router.get("/addproject", renderAddProject);
router.get("/api/projects", getProjects);
router.post("/addproject", addProject);
router.get("/project/:title", getProjectDetails);
// END PROJECT

router.get("/contact", renderContact);
router.get("/testimonial", renderTestimonial);

router.get("/api/testimonials", getTestimonials);


router.use("*", render404);

module.exports = router;
