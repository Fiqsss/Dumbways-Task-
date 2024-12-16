const express = require("express");
const exphbs = require("express-handlebars");
const {Pool} = require("pg");


const app = express();

const pool = new Pool({
  user: "postgres", 
  host: "localhost",    
  database: "dumbwaysTask", 
  password: "111", 
  port: 7000, 
});


app.engine("hbs", exphbs.engine(
  {
    extname: ".hbs",
  }
));

app.set("view engine", "hbs");

// app.set("views", "./views"); //

app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("home", {
    isActive: true,
    title: "Home | Dumbways Task",
  });
});

app.get("/blog", (req, res) => {
  res.render("blog", {
    isBlog: true,
    title: "Blog | Dumbways Task",
  });
});

app.get("/project", (req, res) => {
  res.render("project", {
    isProject: true,
    title: "Project | Dumbways Task",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    isContact: true,
    title: "Contact | Dumbways Task",
  });
});

app.get("/testimonial", (req, res) => {
  res.render("testimonial", {
    isTestimonial: true,
    title: "Testimonial | Dumbways Task",
  });
});

app.get("/api/testimonials", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM testimonial");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("*", (req, res) => {
  res.render("partials/404");
})
app.listen(9000, () => {
  console.log("listening in http://localhost:9000");
});
