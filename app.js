const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redis = require("redis");
const client = redis.createClient();
const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const routes = require("./routes/routes");
require("dotenv").config();

const { Sequelize } = require("sequelize");
const config = require("./config/config");

// Konfigurasi Sequelize
const environment = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[environment]);

const app = express();

app.use(
  session({
    secret: "fghvN98djH@3lk&9Js1#Xq!oAf*Zn0!",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use((req, res, next) => {
  res.locals.flash = req.session.flash || {};
  delete req.session.flash;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));

hbs.handlebars.registerHelper("includes", (array, value) => {
  return array.constructor === Array && array.includes(value);
});


hbs.handlebars.registerHelper("eq", (a, b) => a === b);

hbs.handlebars.registerHelper("increasePrice", (price) => price + 10);

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "./public")));

app.use("/", routes);

app.listen(9000, () => {
  console.log(`Server berjalan di http://localhost:9000`);
});
