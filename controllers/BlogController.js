const { getRelativeTime, formatDate } = require("../utils/time");
const fs = require("fs");
const path = require("path");
const { truncateText } = require("../utils/truncateText");
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("../config/config");
const sequelize = new Sequelize(config.production);
const { Blogs, Users } = require("../models");

// SEARCH BLOG
exports.searchBlog = async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.redirect("/blog");
  }

  try {
    const result = await Blogs.findAll({
      where: {
        title: {
          [Sequelize.Op.like]: `%${searchQuery}%`,
        },
      },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const updatedBlogs = result.map((blog) => {
      const postDate = new Date(blog.post_date);
      const formattedDate = postDate
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .toString();

      return {
        ...blog.dataValues,
        content: truncateText(blog.content, 150),
        time: getRelativeTime(new Date(postDate)),
        postDate: formattedDate,
      };
    });

    res.render("blog", {
      actived: "blog",
      title: "Blog | Dumbways Task",
      blogs: updatedBlogs,
      searchQuery: searchQuery,
      user: req.session.user,
    });
  } catch (err) {
    const code = 500;
    const codeArray = [code];
    console.error("Error searching blogs:", err.message);
    res.status(500).render("partials/404", {
      message: "Internal Server Error",
      codeArray: codeArray,
    });
  }
};
// END SEARCH BLOG

// RENDER BLOG
exports.renderBlog = async (req, res) => {
  try {
    const data = await Blogs.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!data || data.length === 0) {
      return res.render("blog", {
        actived: "blog",
        title: "No Blogs Found",
        blogs: [],
        user: req.session.user,
      });
    }

    const blogs = data.map((blog) => {
      const postDate = blog.post_date || blog.createdAt;
      const formattedDate = new Date(postDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return {
        ...blog.dataValues,
        content: truncateText(blog.content, 150),
        time: getRelativeTime(new Date(postDate)),
        postDate: formattedDate,
      };
    });

    res.render("blog", {
      actived: "blog",
      title: "Blog | Dumbways Task",
      user: req.session.user,
      blogs: blogs,
    });
  } catch (err) {
    console.error("Error fetching blog posts:", err.message);
    res.status(500).render("partials/404", {
      message: "Internal Server Error",
      codeArray: [500],
    });
  }
};
// END RENDER BLOG

// RENDER DETAIL BLOG
exports.renderDetailBlog = async (req, res) => {
  try {
    const result = await Blogs.findAll({
      where: { title: req.params.title },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (result.length === 0) {
      return res.status(404).render("partials/404", {
        message: "Halaman Blog tidak ditemukan.",
        codeArray: [404],
      });
    }

    const blog = result[0].get({ plain: true });
    const postDate = blog.post_date ? new Date(blog.post_date) : null;

    if (!postDate || isNaN(postDate)) {
      return res.status(500).render("partials/404", {
        message: "Invalid post date in blog data.",
        codeArray: [500],
      });
    }

    const formattedDate = postDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    blog.time = getRelativeTime(postDate);
    blog.postDate = formattedDate;
    console.log("Blog:", blog.user);
    res.render("partials/blog/detailblog", {
      title: "Blog | Dumbways Task",
      blog: blog,
      actived: "blog",
      user: req.session.user,
    });
  } catch (err) {
    console.error(err.message);
    res.render("partials/404", {
      message: "Internal Server Error",
      codeArray: [500],
    });
  }
};

// END RENDER DETAIL BLOG

// RENDER ADD BLOG
exports.renderaddBlog = async (req, res) => {
  if (!req.session || !req.session.user) {
    req.session.flash = {
      message: "Please log in to add a blog.",
      type: "error",
    };
    return res.status(401).redirect("/blog");
  }
  res.render("partials/blog/addblog", {
    title: "Add Blog | Dumbways Task",
    user: req.session.user,
  });
};
// END RENDER ADD BLOG

// RENDER EDIT BLOG
exports.rendereditBlog = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      req.session.flash = {
        message: "Please log in to edit a blog.",
        type: "error",
      };
      return res.status(401).redirect("/blog");
    }

    const userId = req.session.user.id;
    const blogId = req.params.id;

    const blog = await Blogs.findOne({
      where: { id: blogId },
    });

    if (!blog) {
      return res.status(404).render("partials/404", {
        message: "Blog not found.",
        codeArray: [404],
      });
    }

    if (blog.user_id !== userId) {
      req.session.flash = {
        message: "You do not have permission to edit this blog.",
        type: "error",
      };
      return res.status(403).redirect("/blog");
    }

    req.session.flash = {
      message: "Blog edited successfully.",
      type: "success",
    };
    res.render("partials/blog/editblog", {
      actived: "blog",
      title: "Edit Blog | Dumbways Task",
      blog: blog.dataValues,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error rendering edit blog page:", err.message);
    res.status(500).render("partials/404", {
      message: "Internal Server Error",
      codeArray: [500],
    });
  }
};

// END RENDER EDIT BLOG

// ADD BLOG
exports.addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageFileName = req.file ? req.file.filename : null;

    if (!title || !content) {
      req.session.flash = {
        message: "Title dan content harus diisi.",
        type: "error",
      };
      return res.redirect("/add-blog");
    }

    await Blogs.create({
      title,
      content,
      user_id: req.session.user.id,
      image: imageFileName,
      post_date: new Date(),
    });

    req.session.flash = {
      message: "The blog has been added successfully.",
      type: "success",
    };
    res.redirect("/blog");
  } catch (error) {
    console.error("Gagal menambahkan blog:", error.message);
    req.session.flash = {
      message: "Gagal menambahkan blog. Silakan coba lagi.",
      type: "error",
    };
    res.redirect("/add-blog");
  }
};

// END ADD BLOG

// EDIT BLOG
exports.editBlog = async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const uploadDir = path.resolve(__dirname, "../public/img/blog/");

  try {
    const blog = await Blogs.findOne({ where: { id } });
    if (!blog) {
      req.session.flash = {
        message: "Blog not found.",
        type: "error",
      };
      return res.status(404).redirect("/blog");
    }

    const oldImage = blog.image;
    let imageFileName = oldImage;

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
      console.log("New image uploaded successfully:", imageFileName);
    }

    await Blogs.update(
      { title, content, image: imageFileName },
      { where: { id } }
    );

    req.session.flash = {
      message: "Blog updated successfully.",
      type: "success",
    };
    res.redirect("/blog");
  } catch (error) {
    console.error("Error updating blog:", error.message);
    req.session.flash = {
      message: "Failed to update blog.",
      type: "error",
    }
    res.status(500).redirect("/blog");
  }
};
// END EDIT BLOG

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  const id = req.params.id;
  const uploadDir = path.resolve(__dirname, "../public/img/blog/");

  try {
    const blog = await Blogs.findOne({ where: { id } });

    if (!blog) {
      req.session.flash = {
        message: "Blog not found.",
        type: "error",
      }
      return res.status(404).redirect("/blog");
    }

    if (req.session && req.session.user) {
      const userId = req.session.user.id;

      if (blog.user_id !== userId) {
        req.session.flash = {
          message: "You are not authorized to delete this blog.",
          type: "error",
        }
        return res.status(403).redirect("/blog");
      }
    } else {
      req.session.flash = {
        message: "Please log in to delete a blog.",
        type: "error",
      }
      return res.status(401).redirect("/blog");
    }

    if (blog.image) {
      const imagePath = path.join(uploadDir, blog.image);

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Image successfully deleted:", blog.image);
        } else {
          console.log("Image not found, skipping deletion:", blog.image);
        }
      } catch (fileErr) {
        console.error("Error deleting image:", fileErr.message);
      }
    }

    await Blogs.destroy({ where: { id } });

    req.session.flash = {
      message: "Blog deleted successfully.",
      type: "success",
    }
    res.redirect("/blog?action=delete");
  } catch (err) {
    console.error("Failed to delete blog:", err.message);
    res.status(500).render("partials/404", {
      message: "Failed to delete blog. Please try again later.",
      codeArray: [500],
    });
  }
};
// END DELETE BLOG
// 404 Controller
