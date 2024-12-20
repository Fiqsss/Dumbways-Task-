const { getRelativeTime, formatDate } = require("../utils/time");
const { Pool } = require("pg");
const path = require("path");
const { rejects } = require("assert");
const { title } = require("process");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dumbwaysTask",
  password: "111",
  port: 7000,
});

exports.renderProject = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    const data = result.rows.map((project) => {
      return {
        ...project,
        time: getRelativeTime(new Date(project.startDate)),
        startDate: formatDate(new Date(project.startDate)),
        endDate: formatDate(new Date(project.endDate)),
      };
    });
    res.render("project", {
      isProject: true,
      title: "Project | Dumbways Task",
      projects: data,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).render("partials/404");
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

exports.getProjectDetails = async (req, res) => {
  const { title } = req.params;
  try {
    const result = await pool.query("SELECT * FROM projects WHERE title = $1", [
      title,
    ]);
    if (result.rows.length > 0) {
      res.render("partials/detailproject", { projects: result.rows[0] });
    } else {
      res.status(404).render("partials/404");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).render("partials/404");
  }
};

exports.addProject = async (req, res) => {
  const { projectname, startdate, enddate, description, technologies } =
    req.body;
  let imageFileName = null;

  const uploadDir = path.resolve(__dirname, "../public/img/project");
  try {
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      imageFileName = imageFile.name;
      const uploadPath = path.join(uploadDir, imageFileName);

      await new Promise((resolve, rejects) => {
        imageFile.mv(uploadPath, (err) => {
          if (err) {
            console.error("Gagal mengunggah gambar:", err);
            rejects(err);
          } else {
            console.log("hambar berhasil di ubah");
            resolve();
          }
        });
      });
    }

    const postDate = new Date();
    const query = `
    INSERT INTO projects (projectname, startdate, enddate, description, technologies,image)
    VALUES ($1, $2, $3, $4,$5)
  `;

    const values = [projectname, startdate, enddate, description, technologies,imageFileName];

    await pool.query(query, values);
    console.log("Data berhasil di simpan");
    res.redirect("/project?action=add");
  } catch (err) {
    console.error(err.message);
    res.status(500).render("partials/404");
  }
};
