require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const isLoggedIn = require("./middlewares/authMiddleware");
const exphbs = require("express-handlebars");
const path = require("path");
const routes = require("./routes/routes");
const methodOverride = require("method-override");

// const fileUpload = require("express-fileupload");
const app = express();
app.use(
  session({
    secret: "fghvN98djH@3lk&9Js1#Xq!oAf*Zn0!",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
});

const PORT = process.env.PORT || 9000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.engine("hbs", hbs.engine);

app.set("view engine", "hbs");

hbs.handlebars.registerHelper("includes", function (array, value) {
  console.log("Checking includes:", array, value);
  if (!Array.isArray(array)) {
    console.error("Array is not defined or not an array:", array);
    return false;
  }
  return array.includes(value);
});

hbs.handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

hbs.handlebars.registerHelper("increasePrice", function (price) {
  price += 10;
  return price;
});


app.use("/", routes);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server berjalan di http://localhost:9000");
});
