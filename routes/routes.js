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
  searchBlog,
  renderDetailBlog
} = require("../controllers/BlogController");

const {
  renderProject,
  renderAddProject,
  getProjects,
  getProjectDetails,
  addProject,
  deleteProject,
  renderEditProject,
  searchProject,
  editProject
} = require("../controllers/ProjectController");

const router = express.Router();

router.get("/", renderHome);

// BLOG
router.get("/blog", renderBlog);
router.get("/addblog", renderaddBlog);
router.delete("/deleteblog/:id", deleteBlog);
router.get("/editblog/:id", rendereditBlog);
router.post("/addBlog", addBlog);
router.post("/editblog/:id", editBlog);
router.get("/searchblog", searchBlog);
router.get("/detailblog/:title", renderDetailBlog);
// END BLOG

// PROJECT
router.get("/project", renderProject);
router.get("/addproject", renderAddProject);
router.get("/api/projects", getProjects);
router.post("/addproject", addProject);
router.get("/project/:title", getProjectDetails);
router.delete("/deleteproject/:id", deleteProject);
router.get("/editproject/:id", renderEditProject);
router.post("/editproject/:id", editProject);
router.get("/searchproject", searchProject);
// END PROJECT

router.get("/contact", renderContact);
router.get("/testimonial", renderTestimonial);

router.get("/api/testimonials", getTestimonials);


router.use("*", render404);

module.exports = router;
