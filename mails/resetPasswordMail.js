const nodeMailer = require('nodemailer')
require('dotenv').config()

const resetPasswordMail = (name, email, token) => {
    try {
        const transpoter = nodeMailer.createTransport({
            host: process.env.HOST,
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Password',
            html: `<p>Hi <b>${name}</b>, I guess you have forgotten your password. Please follow this link to <a href = "http://15.206.128.120:8000/api/v1/resetPassword?token=${token}"> <b> reset your password</b></a></p>`
        }
        transpoter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log('Email has been sent...', info.response)
            }
        })

    } catch (error) {
        //res.status(400).send({ success: false, msg: error.message });

    }
};

module.exports = resetPasswordMail;
