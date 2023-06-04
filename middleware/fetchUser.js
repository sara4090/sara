const JWT = require('jsonwebtoken')
require('dotenv').config()
const secKey = process.env.JWT_KEY


const fetchUser = async(req, res, next) => {
    const token = req.header('auth')
        if(!token){
            res.status(401).send({error: "User authentication is required..."})
        }
        try{
            const data = JWT.verify(token, secKey)
            req.user = data.user;
            next()  
    } catch (error) {
        console.error(error.message)
    }
}

module.exports =  fetchUser 