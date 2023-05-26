const express = require('express');
const router = express.Router()
const multer = require('multer');
const { importData } = require('../data/importData');
const upload = multer({ dest: 'uploads/' });
// const xlsx = require('xlsx')
// const multer = require('multer')
// const path = require('path')
// const Product = require('../models/Product')
// const csv = require('csvtojson')

// let storage = multer.diskStorage({
//    destination: (req, file, cb) => { cb(null, './public/upload') },
//    filename: (req, file, cb) => { cb(null, file.originalname) }
// })
// let upload = multer({ storage: storage })


// router.post('/import', upload.single('file'), async(req, res) => {
//   const filePath = req.file.path;

//   const workbook = xlsx.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
//   console.log(sheetData)

//   const dataimported =await Product.insertMany(sheetData)

//   res.send({message: 'Import successful',data: dataimported});
  
// });


router.post('/upload', upload.single('file'), importData )





module.exports = router;