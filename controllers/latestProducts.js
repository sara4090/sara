const Product = require('../models/Product')

const latestProducts = async (req, res) => {
    try {
        const latest = await Product.find().sort('-date').limit(10);

        res.status(200).send({ latest });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
}

module.exports = { latestProducts }