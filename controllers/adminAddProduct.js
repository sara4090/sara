const Product = require('../models/Product')
require('dotenv').config()
const { getDataUri } = require("../data/productData");
const { validationResult } = require('express-validator')
const cloudinary = require("cloudinary");

const adminAddProduct = async (req, res) => {
  try {


    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     res.status(400).send({ error: errors.array() })
    // }

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.CLOUD_SECRET,
      secure: true
    });

    const filteredReqBody = Object.fromEntries(Object.entries(req.body).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
    );

    const { images } = req.files;
    let imagesArray;

    if (images) {
      const imgUrl = await Promise.all(
        images.map((image) => getDataUri(image))
      );

      const uploadImages = await Promise.all(
        imgUrl.map((imageUri) =>
          cloudinary.v2.uploader.upload(imageUri.content)
        )
      );

      imagesArray = uploadImages.map((upload) => ({
        public_id: upload.public_id,
        url: upload.secure_url,
      }));
    }



    const product = new Product({
      ...filteredReqBody,
      images: imagesArray
    });

    await product.save();

    res.status(201).json({ message: "Your product added successfully", product });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: error.message });
  }
};

module.exports = { adminAddProduct }