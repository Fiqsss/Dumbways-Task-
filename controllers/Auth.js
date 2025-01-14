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
      req.session.flash = {
        message: "Passwords do not match.",
        type: "error",
      };
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
      req.session.flash = {
        message: errorMessage,
        type: "error",
      };
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ username, email, password: hashedPassword });

    req.session.flash = {
      message: "Registration successful!",
      type: "success",
    };
    return res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.session.flash = {
      message: "An error occurred during registration.",
      type: "error",
    };
    return res.redirect("/register");
  }
};

exports.authLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      req.session.flash = {
        message: "Invalid username or password.",
        type: "error",
      };
      return res.redirect("/login");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      req.session.flash = {
        message: "Invalid username or password.",
        type: "error",
      };
      return res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    req.session.flash = {
      message: "Login successful!",
      type: "success",
    };
    return res.redirect("/?success=true");
  } catch (error) {
    console.error("Login error:", error);
    req.session.flash = {
      message: "An error occurred during login.",
      type: "error",
    }
    return res.redirect("/login");
  }
};
