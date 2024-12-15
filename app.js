const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views"); //

app.use(express.static("public"));

// app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/blog", (req, res) => {
  res.render("blog");
});

app.get("/project", (req, res) => {
  res.render("project");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("*", (req, res) => {
  res.render("404");
})
app.listen(9000, () => {
  console.log("listening in http://localhost:9000");
});
