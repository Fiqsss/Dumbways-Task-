// const express = require("express");
// const exphbs = require("express-handlebars");
// const { Pool } = require("pg");

// const app = express();

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "dumbwaysTask",
//   password: "111",
//   port: 7000,
// });

// app.engine(
//   "hbs",
//   exphbs.engine({
//     extname: ".hbs",
//   })
// );

// app.set("view engine", "hbs");

// // app.set("views", "./views");
// const path = require("path");
// const { error } = require("console");

// app.use(express.static(path.join(__dirname, "./public")));

// // ROUTING START
// // <----------------------------------------------------------------------------->
// // <----------------------------------------------------------------------------->

// app.get("/", (req, res) => {
//   res.render("home", {
//     isActive: true,
//     title: "Home | Dumbways Task",
//   });
// });

// // <-------------------------------->

// app.get("/blog", (req, res) => {
//   res.render("blog", {
//     isBlog: true,
//     title: "Blog | Dumbways Task",
//   });
// });

// // <-------------------------------->

// app.get("/project", (req, res) => {
//   res.render("project", {
//     isProject: true,
//     title: "Project | Dumbways Task",
//   });
// });

// // <-------------------------------->

// app.get("/contact", (req, res) => {
//   res.render("contact", {
//     isContact: true,
//     title: "Contact | Dumbways Task",
//   });
// });
// // <-------------------------------->

// app.get("/testimonial", (req, res) => {
//   res.render("testimonial", {
//     isTestimonial: true,
//     title: "Testimonial | Dumbways Task",
//   });
// });

// // <----------------------------------------------------------------------------->
// // <----------------------------------------------------------------------------->
// app.get("/api/testimonials", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM testimonials");
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/api/projects", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM projects");
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: "Internal Error" });
//   }
// });

// app.get("/project/:title", async (req, res) => {

//   const { title } = req.params;

//   try {
//     const result = await pool.query("SELECT * FROM projects WHERE title = $1", [title]);
//     if (result.rows.length > 0) {
//       const data = result.rows[0];
//       res.render("partials/detailproject", { projects: data });
//     } else {
//       res.status(404).render("partials/404");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).render("partials/404");
//   }
// });

// // <----------------------------------------------------------------------------->
// // <----------------------------------------------------------------------------->

// app.get("*", (req, res) => {
//   res.render("partials/404");
// });


// app.listen(9000, () => {
//   console.log("berjalan di http://localhost:9000");
// });

const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");
const routes = require("./routes/routes");
const methodOverride = require('method-override');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/", routes);

app.listen(9000, () => {
  console.log("Server berjalan di http://localhost:9000");
});
