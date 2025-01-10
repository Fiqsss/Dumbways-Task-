require("dotenv").config();
const { truncateText } = require("../utils/truncateText");
const path = require("path");
const fs = require("fs");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("../config/config");
const sequelize = new Sequelize(config.production);

const { Testimoni } = require("../models");

exports.renderTestimonial = async (req, res) => {
  try {
    const result = await Testimoni.findAll({
      order: [["createdAt", "DESC"]],
    });
    const data = result.map((testimoni) => {
      return {
        ...testimoni.dataValues,
        description: truncateText(testimoni.description, 50),
      };
    });
    res.render("testimonial", {
      actived: "testimonial",
      title: "Testimonial | Dumbways Task",
      user: req.session.user,
      testimonis: data,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.filterByRating = async (req, res) => {
  try {
    const { rating } = req.params;
    const result = await Testimoni.findAll({
      where: {
        rating: parseInt(rating),
      },
      order: [["createdAt", "DESC"]],
    });

    if (result.length === 0) {
      return res.render("testimonial", {
        actived: "testimonial",
        title: `Testimonial | Dumbways Task`,
        user: req.session.user,
        testimonis: [],
        message: "No testimonial found with rating " + rating,
        isEmpty: true,
      });
    }

    const data = result.map((testimoni) => {
      return {
        ...testimoni.dataValues,
        description: truncateText(testimoni.description, 50),
      };
    });
    res.render("testimonial", {
      actived: "testimonial",
      title: `Testimonial | Dumbways Task`,
      testimonis: data,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
