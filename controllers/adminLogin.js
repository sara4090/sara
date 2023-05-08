const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const { validationResult } = require('express-validator')
require('dotenv').config()
const secKey = process.env.JWT_KEY

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ error: errors.array() })
        }
        const user = await Admin.findOne({ email: email })
        if (user) {
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (passwordCompare) {
                if (user.is_verified === 0) {
                    res.send({ message: "please verify your mail..." })
                }
                req.session.userId = user._id
            }

            if (!passwordCompare) {
                return res.status(400).send({ error: "Please login with correct credentials." })
            }
        }
        if (!user) {
            return res.status(401).send({ error: "Please login with correct credentials." })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        req.session.userId = user.id
        console.log(user.id)
        const authToken = JWT.sign(data, secKey)
        res.status(200).send({ authToken })


    } catch (error) {
        res.status(400).send({ error: error.message })

    }
}

module.exports = { adminLogin }