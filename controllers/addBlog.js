const Blog = require("../models/Blog");
const { getDataUri } = require("../data/productData");
const cloudinary = require("cloudinary");
const { validationResult } = require('express-validator')


require('dotenv').config()


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



    const blog = new Blog({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      images: imagesArray,
      author: req.body.author
    });

    await blog.save();

    res.send({ message: "Your blog added successfully", blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBlog,
};
