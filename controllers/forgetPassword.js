const User = require('../models/User');
const randomString = require('randomstring')
const resetPasswordMail = require('../mails/resetPasswordMail')


const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email
        const userData = await User.findOne({ email: email });
        if (userData) {
            if (userData.is_verified === 0) {
                return res.status(300).send({ message: "Please verify your mail..." })
            }
            else {
                const rString = randomString.generate();
                const data = await User.updateOne({ email: email }, { $set: { token: rString } })
                resetPasswordMail(userData.name, userData.email, rString)
                res.status(200).send({ success: true, msg: "Please check your mail..." })
            }


        }
        else {
            res.status(200).send({ success: false, msg: "Email does not exists..." })
        }
    } catch (error) {
        //res.status(400).send({ success: false, msg: error.message });

    }
}

module.exports = { forgetPassword }