require('dotenv').config();
const { getRelativeTime, formatDate } = require("../utils/time");
const { truncateText } = require("../utils/truncateText");
const path = require("path");
const fs = require("fs");

const { Sequelize, QueryTypes } = require('sequelize');
const config = require('../config/config.json');

const sequelize = new Sequelize(config.development);

exports.renderProject = async (req, res) => {
  try {
    const result = await sequelize.query(
      "SELECT * FROM projects ORDER BY id",
      { type: QueryTypes.SELECT }
    );

    const data = result.map((project) => {
      const startDate = project.startdate ? new Date(project.startdate) : null;
      const endDate = project.enddate ? new Date(project.enddate) : null;

      const durationInMonths =
        startDate && endDate
          ? (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())
          : 0;

      return {
        ...project,
        time: startDate ? getRelativeTime(startDate) : "Unknown time",
        startDate: startDate ? formatDate(startDate) : "Unknown date",
        duration: durationInMonths > 0 ? `${durationInMonths} bulan` : "0 bulan",
        description: truncateText(project.description, 50),
      };
    });

    res.render("project", {
      actived: "project",
      title: "Project | Dumbways Task",
      projects: data,
    });
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res
      .status(500)
      .render("partials/404", { message: "Internal Server Error" });
  }
};

exports.searchProject = async (req, res) => {
  try {
    const query = req.query.search;
    if (!query) {
      return res.redirect("/project");
    }

    const result = await sequelize.query(
      "SELECT * FROM projects WHERE projectname LIKE :search",
      {
        type: QueryTypes.SELECT,
        replacements: { search: `%${query}%` },
      }
    );
    const data = result.map((project) => {
      return {
        ...project,
        description: truncateText(project.description, 50),
      }
    })

    res.render("project", {
      actived: "project",
      title: "Project | Dumbways Task",
      projects: data, 
      search: query,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).render("partials/404", { message: "Internal Server Error" });
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
  res.render("partials/project/addproject", {
    title: "Add Project | Dumbways Task",
  });
};

const { Op } = require("sequelize");

exports.getProjectDetails = async (req, res) => {
  const { title } = req.params;

  try {
    // Validasi input
    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .render("partials/404", { message: "Invalid project title" });
    }

    const result = await sequelize.query(
      "SELECT * FROM projects WHERE projectname = :title",
      {
        replacements: { title },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length > 0) {
      const project = result[0];
      const startDate = new Date(project.startdate);
      const endDate = new Date(project.enddate);

      if (isNaN(startDate) || isNaN(endDate)) {
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
      });
    } else {
      return res
        .status(404)
        .render("partials/404", { message: "Project not found" });
    }
  } catch (err) {
    console.error("Error fetching project details:", err.message);
    return res
      .status(500)
      .render("partials/404", { message: "Internal Server Error" });
  }
};


exports.addProject = async (req, res) => {
  const { projectname, startdate, enddate, description, technologies } = req.body;
  let imageFileName = null;

  const uploadDir = path.resolve(__dirname, "../public/img/project");

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      imageFileName = imageFile.name;
      const uploadPath = path.join(uploadDir, imageFileName);

      await new Promise((resolve, reject) => {
        imageFile.mv(uploadPath, (err) => {
          if (err) {
            console.error("Gagal mengunggah gambar:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    const technologiesArray = Array.isArray(technologies)
      ? technologies
      : technologies.split(",").map((tech) => tech.trim());

    const query = `
      INSERT INTO projects (projectname, startdate, enddate, description, technologies, image)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      projectname,
      startdate,
      enddate,
      description,
      technologiesArray, 
      imageFileName,
    ];

    await sequelize.query(query, {
      bind: values,
      type: sequelize.QueryTypes.INSERT,
    });

    console.log("Data berhasil disimpan");
    res.redirect("/project?action=add");
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).render("partials/404", {
      message: "Terjadi kesalahan saat menambahkan proyek",
    });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const result = await sequelize.query(
      "DELETE FROM projects WHERE id = :id",
      {
        replacements: { id: req.params.id },
        type: sequelize.QueryTypes.DELETE,
      }
    );

    res.redirect("/project?action=delete");
  } catch (err) {
    console.error("Error saat menghapus proyek:", err.message);
    res.status(500).render("partials/404", { message: "Internal Server Error" });
  }
};


exports.renderEditProject = async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT * FROM projects WHERE id = '${req.params.id}'`
    );

    if (result[0].length === 0) {
      return res.status(404).render("partials/404", {
        message: "Project not found",
      });
    }

    const project = result[0][0];

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
    } else if (Array.isArray(project.technologies)) {
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
    });
  } catch (err) {
    console.error("Error rendering edit project:", err.message);
    res.status(500).render("partials/404", {
      message: "Internal Server Error",
    });
  }
};


exports.editProject = async (req, res) => {
  try {
    const { projectname, startdate, enddate, description, technologies } =
      req.body;
    let imageFileName = null;

    const uploadDir = path.resolve(__dirname, "../public/img/project");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const result = await sequelize.query(
      "SELECT image FROM projects WHERE id = :id",
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
    );
    const oldImage = result.length > 0 ? result[0].image : null;

    if (req.files && req.files.image && req.files.image.name) {
      const imageFile = req.files.image;
      imageFileName = Date.now() + "_" + imageFile.name;

      if (oldImage) {
        const oldImagePath = path.join(uploadDir, oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const uploadPath = path.join(uploadDir, imageFileName);
      await new Promise((resolve, reject) => {
        imageFile.mv(uploadPath, (err) => {
          if (err) {
            console.error("Gagal mengunggah file:", err);
            return reject(err);
          }
          resolve();
        });
      });
    } else {
      imageFileName = oldImage;
    }

    const technologiesArray = technologies
      ? Array.isArray(technologies)
        ? technologies
        : technologies.split(",").map((tech) => tech.trim())
      : [];

    const query = `
      UPDATE projects
      SET projectname = :projectname,
          startdate = :startdate,
          enddate = :enddate,
          description = :description,
          technologies = ARRAY[:technologies]::text[], -- Ubah ke array
          image = :image
      WHERE id = :id
    `;
    const values = {
      projectname,
      startdate,
      enddate,
      description,
      technologies: technologiesArray,
      image: imageFileName,
      id: req.params.id,
    };

    await sequelize.query(query, {
      replacements: values,
      type: QueryTypes.UPDATE,
    });

    console.log("Data berhasil diupdate");
    res.redirect("/project?action=update");
  } catch (err) {
    console.error("Error saat mengedit proyek:", err.message);
    res.status(500).render("partials/404", { message: "Internal Server Error" });
  }
};
