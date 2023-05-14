let xlsx = require('xlsx')
const path = require('path')
const { validationResult } = require('express-validator')
const Product = require('../models/Product');
const importData = async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).send({ error: errors.array() })
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const allowedExtensions = ['.xlsx', '.xls', '.csv', '.pdf'];
  const fileExtension = path.extname(req.file.originalname);
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({ message: 'Invalid file type' });
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; 
  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ message: 'File too large' });
  }

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

  const expectedSheetName = 'Sheet1';
  if (workbook.SheetNames.indexOf(expectedSheetName) === -1) {
    return res.status(400).json({ message: 'Invalid Excel sheet' });
  }

  const sheet = workbook.Sheets[expectedSheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  try {
    await Product(data);
    return res.status(200).json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error importing data' });
  }
};

module.exports = { importData }