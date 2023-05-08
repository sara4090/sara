const XLSX = require('xlsx');
const Product = require('../models/Product')

const importXlsxFile =async (req, res) => {
    const file = req.files.file;

    try {
      // Parse the XLSX file
      const workbook = XLSX.read(file.data, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
  
      // Insert the parsed data into MongoDB
      let result = await Product({data});
        console.log(result)
      res.status(200).send({message: 'Import successful!', result});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
}

module.exports = { importXlsxFile };