const { Sequelize, QueryTypes } = require("sequelize");
const session = require("express-session");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const sequelize = new Sequelize(config.production);
const { Users } = require("../models");

exports.authRegister = async (req, res) => {
  const { username, email, password, repassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (password !== repassword) {
      req.flash(
        "error",
        "Password not match, make sure your password is match"
      );
      return res.redirect("/register");
    }
    const existingUser = await Users.findOne({ where: { username } });
    const existingEmail = await Users.findOne({ where: { email } });
    if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/register");
    }
    if(existingEmail)
    {
      req.flash("error", "Email already exists");
      return res.redirect("/register");
    }
    const result = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    if (result) {
      req.flash("success", "Register Successfully ");
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error saat registrasi:", error.message);
    req.flash("error", "An error occurred during registration. Please try again.");
    res.redirect("/register?");
  }
};

exports.authLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });
    if (!user) {
      console.error("Login gagal: Username tidak ditemukan");
      req.flash(
        "error",
        "Login Failed: make sure your username or password is correct"
      );
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Login gagal: Password salah");
      req.flash(
        "error",
        "Login Failed: make sure your username or password is correct"
      );
      return res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    delete req.session.user.password;
    req.flash("success", "Login Successfully");
    return res.redirect("/?success=true");
  } catch (error) {
    console.error("Error saat login:", error.message);
    req.flash("error", "Terjadi kesalahan saat login");
    return res.redirect("/login");
  }
};
