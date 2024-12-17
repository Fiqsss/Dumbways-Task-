const express = require("express");
const {
  renderHome,
  renderBlog,
  renderProject,
  renderContact,
  renderTestimonial,
  getTestimonials,
  getProjects,
  getProjectDetails,
  render404,
  addBlog,
} = require("../controllers/controllers");

const router = express.Router();

router.get("/", renderHome);
router.get("/blog", renderBlog);
router.get("/project", renderProject);
router.get("/contact", renderContact);
router.get("/testimonial", renderTestimonial);

router.get("/api/testimonials", getTestimonials);
router.get("/api/projects", getProjects);

router.get("/project/:title", getProjectDetails);

router.post("/addBlog", addBlog);

router.use("*", render404);

module.exports = router;
