const Blog = require('../models/Blog')
const cloudinary = require('cloudinary');

const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, description, author } = req.body;

        const update = {};

        if (title) {
            update.title = title;
        }
        if (description) {
            update.description = description;
        }
        if (author) {
            update.author = author;
        }
        const blog = await Blog.findById(blogId);

        if (req.body.images) {
            // Delete the existing image from Cloudinary
            const imageId = product.images.public_id;
            if (imageId) {
                await cloudinary.uploader.destroy(imageId);
            }
            // Upload the new image to Cloudinary and get the public ID
            const newImage = await cloudinary.uploader.upload(req.body.images, {
                folder: 'products',
                width: 1024,
                crop: 'scale'
            });
            update.images = { public_id: newImage.public_id, url: newImage.secure_url };
        }

        const updateBlog = await Blog.findByIdAndUpdate(blogId, update, { new: true });
        if (!updateBlog) {
            return res.status(404).send("Blog not found");

        }
        return res.status(200).send({ message: "Blog updated successfully", updatedBlog: updateBlog });


    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = { updateBlog };