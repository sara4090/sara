const User = require('../models/User');
require('dotenv').config();
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const secKey = process.env.JWT_KEY
const sendVerificationEmail = require('../mails/verificationEmail')

//Hashing Password
const hashedPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, 10)
        return hash;

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}
const signup = async (req, res) => {
    try {


        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).send({ error: errors.array() })
        }

        const secPass = await hashedPassword(req.body.password)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            confirmPassword: req.body.confirmPassword,
            jobTitle: req.body.jobTitle,
            phoneNumber: req.body.phoneNumber,
            companyName: req.body.companyName,
            country: req.body.country,
            address: req.body.address,
            is_admin: 0,
        })
        const userdata = await User.findOne({ email: req.body.email });
        if (userdata) {
            res.status(200).send({ success: false, message: "Email already exists" })
        }
        else {
            const user_data = await user.save();
            console.log(user_data)
            const data = {
                user: {
                    id: user_data.id
                }
            }
            const authToken = JWT.sign(data, secKey);
            sendVerificationEmail(req.body.name, req.body.email, user_data.id);
            res.status(200).send({ success: true, message: "Successfully signed up, please verify your mail." })
        }
    } catch (error) {
        //res.status(500).send({ error: error.message })
    }
}

module.exports = { signup }