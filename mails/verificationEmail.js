const nodeMailer = require('nodemailer')
require('dotenv').config()


const sendVerificationEmail = async (name, email, userId) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOtions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify your Email',
            html: `<p>Hi ${name}, Hope you are doing well. Please follow this link to <a href = "http://localhost:8000/api/v1/verify?id=${userId}"> verify your email </a></p>`
        }

        transporter.sendMail(mailOtions, (err, info) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log('Email has been sent...', info.response)
            }
        })
    } catch (error) {
        console.error(error.message)
    }
}
module.exports = sendVerificationEmail;