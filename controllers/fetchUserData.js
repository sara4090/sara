const User = require('../models/User');

const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password").select("-confirmPassword")
        res.send({ user })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error...")
    }
}

module.exports = { getUserDetails }