const Product = require('../models/Product');

const adminFetchProducts = async (req, res) => {
    try {
        const product = await Product.find({}).limit(15);

        if (!product) {
            return res.status(404).send({ message: "Products not found" });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}
module.exports = { adminFetchProducts }