require('dotenv').config()
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');

// Configure nodemailer with your email service provider's credentials
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Define a route for uploading the Excel file
const sendAttachment = (req, res) => {
  const { email } = req.body;

  const workbook = xlsx.readFile(req.file.path);

  transporter.sendMail({
    from: email,
    to: process.env.EMAIL,
    subject: 'Excel Sheet',
    text: 'Please find the attached Excel sheet.',
    attachments: [{
      filename: 'excel_sheet.xlsx',
      content: xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
    }],
  }, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error);
      res.status(500).send('Error occurred while sending email.');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully.');
    }
  });
};

module.exports = { sendAttachment }