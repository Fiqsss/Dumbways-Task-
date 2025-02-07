require("dotenv").config();
const { getRelativeTime, formatDate } = require("../utils/time");
const { truncateText } = require("../utils/truncateText");
const path = require("path");
const fs = require("fs");

const { Sequelize, QueryTypes } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config.production);

const { Projects } = require("../models");

exports.renderProject = async (req, res) => {
  try {
    const result = await Projects.findAll({
      order: [["createdAt", "DESC"]],
    });

    const data = result.map((project) => {
      const startDate = project.startdate ? new Date(project.startdate) : null;
      const endDate = project.enddate ? new Date(project.enddate) : null;

      const durationInMonths =
        startDate && endDate
          ? (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())
          : 0;

      return {
        ...project.dataValues,
        duration:
          durationInMonths > 0 ? `${durationInMonths} bulan` : "0 bulan",
        description: truncateText(project.description, 50),
      };
    });

    res.render("project", {
      actived: "project",
      title: "Project | Dumbways Task",
      projects: data,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res
      .status(500)
      .render("partials/404", { message: "Internal Server Error" });
  }
};

exports.searchProject = async (req, res) => {
  const searchQuery = req.query.search;
  if (!searchQuery) {
    return res.redirect("/project");
  }
  try {
    const result = await Projects.findAll({
      where: {
        projectname: {
          [Sequelize.Op.like]: `%${searchQuery}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    const data = result.map((project) => {
      return {
        ...project.dataValues,
        description: truncateText(project.description, 50),
      };
    });

    res.render("project", {
      actived: "project",
      title: "Project | Dumbways Task",
      projects: data,
      search: searchQuery,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .render("partials/404", { message: "Internal Server Error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.renderAddProject = (req, res) => {
  console.log(req.originalUrl);
  res.render("partials/project/addproject", {
    title: "Add Project | Dumbways Task",
    user: req.session.user,
    actived: "project",
  });
};

exports.getProjectDetails = async (req, res) => {
  const { title } = req.params;

  try {
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .render("partials/404", { message: "Invalid project title" });
    }

    const result = await Projects.findOne({
      where: { projectname: title.trim() },
    });

    if (!result) {
      return res
        .status(404)
        .render("partials/404", { message: "Project not found" });
    }

    const project = result.dataValues || result;
    console.log(project);

    const startDate = project.startdate ? new Date(project.startdate) : null;
    const endDate = project.enddate ? new Date(project.enddate) : null;

    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
      return res
        .status(400)
        .render("partials/404", { message: "Invalid project dates" });
    }

    const durationInMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    return res.render("partials/project/detailproject", {
      projects: project,
      duration: durationInMonths,
      user: req.session.user,
      actived: "project",
    });
  } catch (err) {
    console.error("Error fetching project details:", err.message);
    return res
      .status(500)
      .render("partials/404", { message: "Internal Server Error" });
  }
};

exports.addProject = async (req, res) => {
  const { projectname, startdate, enddate, description, technologies } =
    req.body;
  let imageFileName = null;

  const uploadDir = path.resolve(__dirname, "../public/img/project");

  try {
    if (
      !projectname ||
      !startdate ||
      !enddate ||
      !description ||
      !technologies
    ) {
      req.session.flash = {
        message: "Please fill in all the required fields.",
        type: "error",
      };
      return res.status(400).render("partials/project/addproject", {
        title: "Add Project | Dumbways Task",
        user: req.session.user,
      });
    }
    if (req.file) {
      imageFileName = req.file.filename;
    }

    // Memeriksa apakah technologies adalah array dengan memeriksa panjangnya
    const technologiesArray =
      typeof technologies === "string"
        ? technologies.split(",").map((tech) => tech.trim())
        : technologies && technologies.length
        ? technologies
        : [];

    const newProject = await Projects.create({
      projectname,
      startdate,
      enddate,
      description,
      technologies: technologiesArray,
      image: imageFileName,
    });

    console.log("Data berhasil disimpan");
    req.session.flash = {
      message: "Project added successfully.",
      type: "success",
    };
    res.redirect("/project?action=add");
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).render("partials/404", {
      message: "Terjadi kesalahan saat menambahkan proyek",
    });
  }
};

exports.renderEditProject = async (req, res) => {
  try {
    const result = await Projects.findOne({
      where: { id: req.params.id },
    });

    if (!result) {
      return res
        .status(404)
        .render("partials/404", { message: "Project not found" });
    }

    const project = result.dataValues || result;
    console.log(project);

    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let selectedTechnologies = [];
    if (typeof project.technologies === "string") {
      selectedTechnologies = project.technologies
        .split(",")
        .map((tech) => tech.trim());
    } else if (project.technologies && project.technologies.length) {
      // Memeriksa apakah technologies adalah array dengan properti length
      selectedTechnologies = project.technologies;
    }

    const allTechnologies = ["Node.js", "React.js", "Next.js", "TypeScript"];

    res.render("partials/project/editproject", {
      title: "Edit Project | Dumbways Task",
      project: {
        ...project,
        startdate: formatDate(project.startdate),
        enddate: formatDate(project.enddate),
      },
      allTechnologies,
      selectedTechnologies,
      user: req.session.user,
      actived: "project",
    });
  } catch (err) {
    console.error("Error rendering edit project:", err.message);
    res.status(500).render("partials/404", {
      message: "Internal Server Error",
    });
  }
};

exports.editProject = async (req, res) => {
  const id = req.params.id;
  const { projectname, startdate, enddate, description, technologies } =
    req.body;
  const uploadDir = path.resolve(__dirname, "../public/img/project/");
  let imageFileName = null;

  try {
    const project = await Projects.findOne({ where: { id } });

    if (!project) {
      req.session.flash = {
        message: "Project not found",
        type: "error",
      };
      return res.status(404).render("partials/404", {
        message: "Project not found",
      });
    }
    const oldImage = project.image;
    imageFileName = oldImage;

    if (req.file) {
      imageFileName = `${Date.now()}_${req.file.originalname}`;

      if (oldImage) {
        const oldImagePath = path.join(uploadDir, oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted successfully.");
        }
      }
      const newImagePath = path.join(uploadDir, imageFileName);
      fs.renameSync(req.file.path, newImagePath);
      console.log("New image uploaded successfully.");
    }

    const technologiesArray = technologies
      ? technologies.length && typeof technologies === "string"
        ? technologies.split(",").map((tech) => tech.trim())
        : technologies
      : [];

    await Projects.update(
      {
        projectname,
        startdate,
        enddate,
        description,
        technologies: technologiesArray,
        image: imageFileName,
      },
      { where: { id } }
    );

    console.log("Data berhasil diupdate");
    req.session.flash = {
      message: "Project updated successfully.",
      type: "success",
    };
    res.redirect("/project");
  } catch (err) {
    console.error("Error saat mengedit proyek:", err.message);
    res
      .status(500)
      .render("partials/404", { message: "Internal Server Error" });
  }
};

exports.deleteProject = async (req, res) => {
  const id = req.params.id;
  const uploadDir = path.resolve(__dirname, "../public/img/project/");

  try {
    const result = await Projects.findOne({
      where: { id },
    });

    if (!result) {
      return res.status(404).render("partials/404", {
        message: "Project not found",
      });
    }

    const imageFileName = result.image;
    console.log(imageFileName);

    if (imageFileName) {
      const imagePath = path.join(uploadDir, imageFileName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Gambar berhasil dihapus.");
      }
    }
    await Projects.destroy({
      where: { id },
    });
    req.session.flash = {
      message: "Project deleted successfully.",
      type: "success",
    };
    res.redirect("/project?action=delete");
  } catch (err) {
    console.error("Error saat menghapus proyek:", err.message);
    res
      .status(500)
      .render("partials/404", { message: "Internal Server Error" });
  }
};
