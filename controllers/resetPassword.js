const User = require('../models/User');
const bcrypt = require('bcryptjs')


const hashedPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10)
    return hashed;
}

 const resetPassword = async(req, res) => {

    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token: token })
        if (tokenData) {
            const password = req.body.password;
            const secPassword = await hashedPassword(password)
            const userData = await User.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: secPassword, token: '' } }, { new: true });
            res.status(200).send({ success: true, msg: "Password has been reset successfully...", user_data: userData }).redirect('/login');

        }
        else {
            res.status(402).send({ success: true, msg: "Link has been expired..." });

        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });

        
    }
 }

 module.exports = { resetPassword }