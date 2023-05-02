const User = require('../models/User')


const userLogout = async(req, res) => {
    try {
        req.session.destroy();
        // res.redirect('/login')
        res.send({success: true, message: "You are logged out successfully..."})
        
    } catch (error) {
        res.send({ error: error.message })
    }
}

module.exports = { userLogout }