const Product = require('../models/Product')
require('dotenv').config()
const { validationResult } = require('express-validator')
const cloudinary = require("cloudinary").v2;

const adminAddProduct = async (req, res) => {
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
        })

        const files = req.files.images;
        console.log(files);
        cloudinary.uploader.upload(files.tempFilePath, async (err, result)=>{
          console.log(result)
          
          const product = new Product({
            title: req.body.title,
            images: {
              url: result.url,
             public_id: result.public_id,
             created_at: result.created_at
            },
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
            inventory: req.body.inventory,
            stock: req.body.stock,
            material: req.body.material,
            ram: req.body.ram,
            storage: req.body.storage,
            color: req.body.color,
            user: req.user.id
        })
        await product.save();
        res.status(200).send({ message: "Your product is added...", product })
        })


        

    } catch (error) {
        console.log(error)
        res.status(400).send({ error: error.message })

    }
}

module.exports = { adminAddProduct }