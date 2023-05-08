const Product = require('../models/Product');

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id.toString();
        const product = await Product.findByIdAndDelete({ _id: productId });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        if (product.user.toString() !== req.user.id) {
            return res.status(401).send({ message: "You are not authorized to delete this product" });
        }
        res.status(200).send({ message: "Product deleted successfully", product })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });

    }
};

module.exports = { deleteProduct }
