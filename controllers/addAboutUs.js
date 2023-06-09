const About = require('../models/About');
const { getDataUri } = require("../data/productData");
const cloudinary = require("cloudinary");
require('dotenv').config()

const addAboutUs = async (req, res) => {
  try {
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

    };

    // const { name,title, description, founders, yearFounded } = req.body;

    // Check if the company information already exists
    const existingCompany = await About.findOne().sort({ _id: -1 });

    if (existingCompany) {
      // Update the existing company information
      existingCompany.name = name;
      existingCompany.title = title;
      existingCompany.description = description;
      existingCompany.founders = founders;
      existingCompany.yearFounded = yearFounded;

      await existingCompany.save();
      res.json(existingCompany);
    } else {
      // Create a new company document
      const newCompany = new About({
        name: String(req.body.name),

        title: String(req.body.title),

        images: imagesArray,
        description: String(req.body.description),

        founders,
        yearFounded,
      });

      await newCompany.save();
      res.json(newCompany);
    }

  }
  catch (error) {
    res.status(500).json({ error: error.message });


  }
}


module.exports = { addAboutUs }