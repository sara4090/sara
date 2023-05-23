const User = require('../models/User')

const verifyMail = async (req, res) => {
    try {
        const verify = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 , new: true } });

        res.status(200).send({ message: "Email verified successfully..." })

        console.log(verify)
    } catch (error) {
        res.status(400).send({ error: error.message })

    }
}

module.exports = { verifyMail }