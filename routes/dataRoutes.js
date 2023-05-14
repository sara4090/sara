const express = require('express');
const router = express.Router()
const { importData } = require('../data/importData');
const upload = require('../middleware/uploadFile');
const { fileValidation } = require('../middleware/validation')

router.post('/import', upload.single('user_file'), fileValidation, importData);






module.exports = router;