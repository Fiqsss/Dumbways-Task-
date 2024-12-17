const { getRelativeTime, formatDate } = require("../utils/time");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dumbwaysTask",
  password: "111",
  port: 7000,
});
let blogs = [];

exports.renderHome = (req, res) => {
  res.render("home", { isActive: true, title: "Home | Dumbways Task" });
};

exports.renderBlog = (req, res) => {
  const updatedBlogs = blogs.map(blog => {
    return {
      ...blog,
      time: getRelativeTime(new Date(blog.postDate)) // Hitung ulang relative time
    };
  });

  res.render("blog", { 
    isBlog: true, 
    title: "Blog | Dumbways Task",
    blogs: updatedBlogs, // Kirim blogs dengan waktu yang diperbarui
  });
};

exports.renderProject = (req, res) => {
  res.render("project", { isProject: true, title: "Project | Dumbways Task" });
};

exports.renderContact = (req, res) => {
  res.render("contact", { isContact: true, title: "Contact | Dumbways Task" });
};

exports.renderTestimonial = (req, res) => {
  res.render("testimonial", {
    isTestimonial: true,
    title: "Testimonial | Dumbways Task",
  });
};

exports.getTestimonials = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM testimonials");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProjectDetails = async (req, res) => {
  const { title } = req.params;
  try {
    const result = await pool.query("SELECT * FROM projects WHERE title = $1", [
      title,
    ]);
    if (result.rows.length > 0) {
      res.render("partials/detailproject", { projects: result.rows[0] });
    } else {
      res.status(404).render("partials/404");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).render("partials/404");
  }
};


exports.addBlog = (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  const blog = {
    author: "Nur Muhammad Arofiq",
    title: title,
    content: content,
    image: image,
    postDate: new Date().toLocaleString(),
    time: getRelativeTime(new Date()),
  };
  
  blogs.push(blog);

  res.redirect("/blog");
};

// 404 Controller
exports.render404 = (req, res) => {
  res.status(404).render("partials/404");
};
