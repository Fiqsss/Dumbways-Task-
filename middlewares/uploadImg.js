const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath;
    if (
      req.originalUrl.includes("addBlog") ||
      req.originalUrl.includes("editBlog")
    ) {
      destinationPath = path.resolve(__dirname, "../public/img/blog");
    } else if (
      req.originalUrl.includes("addproject") ||
      req.originalUrl.includes("editproject")
    ) {
      destinationPath = path.resolve(__dirname, "../public/img/project");
    } else {
      return cb(new Error("Invalid upload route"), false);
    }

    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadImg = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

module.exports = { uploadImg };
