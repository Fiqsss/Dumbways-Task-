const { Sequelize, Op } = require("sequelize");
const session = require("express-session");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const sequelize = new Sequelize(config[process.env.NODE_ENV]);
const { Users } = require("../models");

exports.authRegister = async (req, res) => {
  const { username, email, password, repassword } = req.body;

  try {
    if (password.trim() !== repassword.trim()) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/register");
    }

    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      const errorMessage =
        existingUser.username === username
          ? "Username already exists"
          : "Email already exists";
      req.flash("error", errorMessage);
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ username, email, password: hashedPassword });

    req.flash("success", "Registration successful!");
    return res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "An error occurred during registration.");
    return res.redirect("/register");
  }
};

exports.authLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    req.flash("success", "Login successful!");
    return res.redirect("/?success=true");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "An error occurred during login.");
    return res.redirect("/login");
  }
};
