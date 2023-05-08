const Admin = require('../models/Admin');
const adminDetails = async (req, res) => {
    try {
        const userId = req.user.id
        const adminDetails = await Admin.findById(userId).select("-password").select("-confirmPassword")
        res.send({ adminDetails })

    } catch (error) {
        res.status(500).send("Internal server error...")

    }
}

module.exports = { adminDetails }