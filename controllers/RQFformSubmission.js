const nodemailer = require('nodemailer');
require('dotenv').config()


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
const submitRfq = (req, res) => {
    const
        { partNumber, mfr, qty, name, companyName, email, telephone, country, comment } = req.body;

        const partNumberList = partNumber.join(', ');
        const mfrList = mfr.join(', ');
        const qtyList = qty.join(', ');


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
        <b>Telephone:<b/> ${telephone},\n
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
};

module.exports = { submitRfq }