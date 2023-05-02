const Product = require('../models/Product')

const popularSearhedProducts = async (req, res) => {
    try {
        const products = await Product.find({
            searchCount: { $gte: 5 },
        })
            .sort({ searchCount: -1 })
            .limit(10);

        return res.send({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
    }
}
module.exports = { popularSearhedProducts }