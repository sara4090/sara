const Product = require('../models/Product');

const recomendedProducts = async (req, res) => {
    try {

        const products = await Product.find().sort({ name: 1 });
        if (products) {

            res.status(200).send({ products });
        }
        else {
            res.send({ message: 'Could not retrieve products', error: error.message });
        }
    }
    catch (error) {

        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {
    recomendedProducts
}