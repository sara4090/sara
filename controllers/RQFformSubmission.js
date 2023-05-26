const nodemailer = require('nodemailer');
const Email = require('../models/Email')
require('dotenv').config()
const { validationResult } = require('express-validator')

// Configure email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Define API endpoint
const submitRfq = async (req, res) => {

    //const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     res.status(400).send({ error: errors.array() })
    // }
    const
        { partNumber, mfr, qty, name, companyName, email, phone, country, comment } = req.body;

    const partNumberList = Array.isArray(partNumber) ? partNumber.join(', ') : [partNumber].join(', ');

    const mfrList = Array.isArray(mfr) ? mfr.join(', ') : [mfr].join(', ');

    const qtyList = Array.isArray(qty) ? qty.join(', ') : [qty].join(', ');

    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: 'New Form Submission',
        html: `<h3>Product's information<h3/>
        <b> Part Number:<b/> ${partNumberList},\n 
        <b>Manufecturer:<b/> ${mfrList},\n 
        <b>Quantity:<b/> ${qtyList}\n
        <h3>User's Information<h3/>
        <b>Name:<b/> ${name},\n
        <b>Company Name:<b/> ${companyName},\n
        <b>Email:<b/> ${email},\n
        <b>Telephone:<b/> ${phone},\n
        <b>Country:<b/> ${country},\n
        <b>Comment:<b/> ${comment}`,


    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ success: true, message: 'Form submitted successfully' });
        }
    });
    // Save email history
    const emailData = new Email({
        products: [
            {
                partNumber,
                mfr,
                qty

            }
        ],
        name,
        companyName,
        email,
        phone,
        country,
        comment
    });
    await emailData.save();
    res.send('data saved')
};


module.exports = { submitRfq }