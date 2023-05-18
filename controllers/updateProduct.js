const Product = require('../models/Product');
const cloudinary = require('cloudinary');

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const { name, title, category, description, price, brand, inventory, stock, material, ram, storage, color } = req.body;

        const update = {};

        if (title) {
            update.title = title;
        }
        if (name) {
            update.name = name;
        }
        if (category) {
            update.category = category;
        }
        if (description) {
            update.description = description;
        }
        if (price) {
            update.price = price;
        }
        if (brand) {
            update.brand = brand;
        }
        if (inventory) {
            update.inventory = inventory;
        }
        if (stock) {
            update.stock = stock;
        }
        if (material) {
            update.material = material;
        }
        if (ram) {
            update.ram = ram;
        }
        if (storage) {
            update.storage = storage;
        }
        if (color) {
            update.color = color;
        }

        // Get the product object from the database
        const product = await Product.findById(productId);

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

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
            new: true,
        });
        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }
        return res.status(200).send({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        return res.status(500).send({error: error.message });
    }
};

module.exports = { updateProduct };
