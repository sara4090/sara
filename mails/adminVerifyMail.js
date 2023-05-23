const Admin = require('../models/Admin')

const adminVerifyerifyMail = async (req, res) => {
    try {
        const verify = await Admin.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 , new: true } });

        res.status(200).send({ message: "Email verified successfully..." })

        console.log(verify)
    } catch (error) {
        res.status(400).send({ error: error.message })

    }
}

module.exports = { adminVerifyerifyMail }