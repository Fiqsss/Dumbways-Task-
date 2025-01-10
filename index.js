const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const routes = require("./routes/routes");
require("dotenv").config();

const { Sequelize } = require("sequelize");
const config = require("./config/config");

// Konfigurasi Sequelize
const environment = process.env.NODE_ENV || "production";
const sequelize = new Sequelize(config[environment]);

// Inisialisasi aplikasi Express
const app = express();

// Konfigurasi session
app.use(
  session({
    secret: "fghvN98djH@3lk&9Js1#Xq!oAf*Zn0!",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Middleware Flash Messages
app.use(flash());

// Middleware untuk JSON dan URL-encoded form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi Handlebars
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// Register Helper untuk Handlebars
hbs.handlebars.registerHelper("includes", (array, value) => {
  return Array.isArray(array) && array.includes(value);
});

hbs.handlebars.registerHelper("eq", (a, b) => a === b);

hbs.handlebars.registerHelper("increasePrice", (price) => price + 10);

// Middleware tambahan
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "./public")));

// Rute utama
app.use("/", routes);

// Jalankan server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
