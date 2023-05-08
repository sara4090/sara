const express = require('express');
const router = express.Router()
const multer = require('multer');
const { importXlsxFile } = require('../data/importXlsx');


// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Set up multer upload configuration
  const upload = multer({ storage: storage }).single('file');


router.post('/import_xlsx', importXlsxFile)






module.exports = router;