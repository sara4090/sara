const multer = require('multer')

// Set up Multer middleware
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});


module.exports = upload;