const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadImages = upload.fields([
  { name: "images", maxCount: 10 }
]);




module.exports = uploadImages;