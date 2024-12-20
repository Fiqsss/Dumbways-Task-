const { getRelativeTime, formatDate } = require("../utils/time");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dumbwaysTask",
  password: "111",
  port: 7000,
});

exports.renderHome = (req, res) => {
  res.render("home", { isActive: true, title: "Home | Dumbways Task" });
};

exports.searchBlog = async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.redirect("/blog");
  }

  try {
    // Query untuk mencari blog berdasarkan title
    const result = await pool.query(
      "SELECT * FROM blogs WHERE title ILIKE $1",
      [`%${searchQuery}%`]
    );

    // Memformat tanggal dan menambahkan data baru
    const updatedBlogs = result.rows.map((blog) => {
      const postDate = new Date(blog.post_date);
      const formattedDate = postDate
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .toString();

      return {
        ...blog,
        time: getRelativeTime(postDate),
        postDate: formattedDate,
      };
    });

    res.render("blog", {
      isBlog: true,
      title: "Blog | Dumbways Task",
      blogs: updatedBlogs, 
      searchQuery: searchQuery,
    });
  } catch (err) {
    console.error("Error searching blogs:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.renderBlog = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs ORDER BY id DESC");
    const updatedBlogs = result.rows.map((blog) => {
      const postDate = new Date(blog.post_date);
      const dateString = postDate.toString();

      const formattedDate = postDate
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .toString();

      return {
        ...blog,
        time: getRelativeTime(postDate),
        postDate: formattedDate,
      };
    });

    res.render("blog", {
      isBlog: true,
      title: "Blog | Dumbways Task",
      blogs: updatedBlogs,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.renderContact = (req, res) => {
  res.render("contact", { isContact: true, title: "Contact | Dumbways Task" });
};

exports.renderTestimonial = (req, res) => {
  res.render("testimonial", {
    isTestimonial: true,
    title: "Testimonial | Dumbways Task",
  });
};

exports.getTestimonials = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM testimonials");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.renderaddBlog = (req, res) => {
  res.render("partials/blog/addblog", { title: "Add Blog | Dumbways Task" });
};
exports.addBlog = async (req, res) => {
  let imageFileName = null;
  const { title, content } = req.body;
  console.log(req.files);
  const uploadDir = path.resolve(__dirname, "../public/img/blog/");

  try {
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      imageFileName = imageFile.name;

      const uploadPath = path.join(uploadDir, imageFileName);
      console.log("Upload Path:", uploadPath);

      await new Promise((resolve, reject) => {
        imageFile.mv(uploadPath, (err) => {
          if (err) {
            console.error("Gagal mengunggah gambar:", err);
            reject(err);
          } else {
            console.log("Gambar berhasil diunggah");
            resolve();
          }
        });
      });
    }

    const postDate = new Date();

    const query = `
      INSERT INTO blogs (title, content, image, post_date)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [title, content, imageFileName, postDate];

    await pool.query(query, values);

    console.log("Blog berhasil disimpan ke database");
    res.redirect("/blog?action=add");
  } catch (error) {
    console.error("Gagal menambahkan blog:", error.message);
    res.status(500).send("Gagal menambahkan blog");
  }
  // if (req.files && req.files.image) {
  //   const imageFile = req.files.image;
  //   imageFileName = imageFile.name;
  //
  //   const uploadPath = path.join(uploadDir, imageFileName);
  //   console.log("Upload Path:", uploadPath);
  //
  //   imageFile.mv(uploadPath, (err) => {
  //     if (err) {
  //       console.error("Gagal mengunggah gambar:", err);
  //       return res.status(500).send("Gagal mengunggah gambar");
  //     }
  //
  //     console.log("Gambar berhasil diunggah");
  //
  //     const blog = {
  //       author: "Nur Muhammad Arofiq",
  //       title: title,
  //       content: content,
  //       image: imageFileName,
  //       postDate: new Date().toLocaleString(),
  //       time: getRelativeTime(new Date()),
  //     };
  //
  //     blogs.push(blog);
  //     res.redirect("/blog");
  //   });
  // } else {
  //   console.log("Tidak ada gambar yang diupload");
  //   res.redirect("/blog");
  // }
};

exports.deleteBlog = async (req, res) => {
  // const index = req.params.index;
  // console.log(index);
  // console.log(blogs);
  // blogs.splice(index, 1);
  // res.redirect("/blog");
  try {
    const result = await pool.query("DELETE FROM blogs WHERE id = $1", [
      req.params.id,
    ]);
    res.redirect("/blog?action=delete");
  } catch (err) {
    console.error(err.message);
    res.status(500).render("partials/404");
  }
};

exports.rendereditBlog = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [
      req.params.index,
    ]);
    res.render("partials/blog/editblog", {
      title: "Edit Blog | Dumbways Task",
      blog: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).render("partials/404");
  }
};

exports.editBlog = async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  let imageFileName = null;

  const uploadDir = path.resolve(__dirname, "../public/img/blog/");

  try {
    const result = await pool.query("SELECT image FROM blogs WHERE id = $1", [
      id,
    ]);
    const oldImage = result.rows[0]?.image;

    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      imageFileName = imageFile.name;

      if (oldImage) {
        const oldImagePath = path.join(uploadDir, oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Menghapus gambar lama
          console.log("Gambar lama berhasil dihapus");
        }
      }
      const uploadPath = path.join(uploadDir, imageFileName);
      await new Promise((resolve, reject) => {
        imageFile.mv(uploadPath, (err) => {
          if (err) {
            console.error("Gagal mengunggah gambar:", err);
            reject(err);
          } else {
            console.log("Gambar berhasil diunggah");
            resolve();
          }
        });
      });
    } else {
      imageFileName = oldImage;
    }

    const query = `
      UPDATE blogs
      SET title = $1, content = $2, image = $3
      WHERE id = $4
    `;
    const values = [title, content, imageFileName, id];

    await pool.query(query, values);

    console.log("Blog berhasil diupdate");
    res.redirect(`/blog?action=update`);
  } catch (error) {
    console.error("Gagal memperbarui blog:", error.message);
    res.status(500).send("Gagal memperbarui blog");
  }
};

// exports.editBlog = (req, res) => {
//   const index = req.params.index;
//   const { title, content } = req.body;
//   const blog = {
//     author: "Nur Muhammad Arofiq",
//     title: title,
//     content: content,
//     image: blogs[index].image,
//     postDate: new Date().toLocaleString(),
//     time: getRelativeTime(new Date()),
//   };
//   blogs[index] = blog;
//   res.redirect("/blog");
// };

// 404 Controller
exports.render404 = (req, res) => {
  res.status(404).render("partials/404");
};
