const Blog = require('../models/Blog')
require('dotenv').config()
const { validationResult } = require('express-validator')
const cloudinary = require("cloudinary").v2;

const addBlog = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ error: errors.array() })
        }

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.CLOUD_SECRET,
            secure: true
        });
        const files = req.files.images;
        console.log(files)
        cloudinary.uploader.upload(files.tempFilePath, async (err, result) => {
            console.log(result)
            const blog = new Blog({
                user: req.user.id,
                title: req.body.title,
                images: {
                    url: result.url,
                    public_id: result.public_id,
                    created_at: result.created_at
                },
                description: req.body.description,
                author: req.body.author,
            })
            await blog.save();
            res.status(200).json({ message: "Your blog is added...", blog })
        })




    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })

    }
}


module.exports = { addBlog }