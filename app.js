const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");
const routes = require("./routes/routes");
const methodOverride = require('method-override');
const app = express();

const hbs = exphbs.create({
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views', 'layouts'), 
});

const PORT = process.env.PORT || 9000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.engine('hbs', hbs.engine); 

app.set("view engine", "hbs");
hbs.handlebars.registerHelper("includes", function (array, value) {
  console.log("Checking includes:", array, value);
  if (!Array.isArray(array)) {
    console.error("Array is not defined or not an array:", array);
    return false;
  }
  return array.includes(value);
});

hbs.handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});



hbs.handlebars.registerHelper('increasePrice', function(price) {
  price+=10;
  return price;
})

require('dotenv').config();

app.use("/", routes);

app.listen(9000, () => {
  console.log("Server berjalan di http://localhost:9000");
  console.log(`test dotenv ${process.env.NODE_ENV}`);
});
