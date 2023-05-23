const Admin = require('../models/Admin');
require('dotenv').config();
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const secKey = process.env.JWT_KEY
const adminMailVerification = require('../mails/adminMailVerification')

//Hashing Password
const hashedPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, 10)
        return hash;

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const adminSignup = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ error: errors.array() })
        }
        const secPass = await hashedPassword(req.body.password)
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            confirmPassword: req.body.confirmPassword,
        })
        const userdata = await Admin.findOne({ email: req.body.email });
        if (userdata) {
            res.status(200).send({ success: false, message: "User already exists" })
        }
        else {
            const user_data = await admin.save();
            console.log(user_data)
            const data = {
                admin: {
                    id: user_data.id
                }
            }
            const authToken = JWT.sign(data, secKey);
            adminMailVerification(req.body.name, req.body.email, user_data.id);
            res.status(200).send({ success: true, message: "Successfully signed up, please verify your mail." })
        }


    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

module.exports = { adminSignup }