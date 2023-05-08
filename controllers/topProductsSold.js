const Product = require('../models/Product');

const getTopProducts = async (req, res) => {
    const { limit } = req.query;

    try {
        if (!limit || isNaN(parseInt(limit))) {
            return res.status(400).send({ message: 'Invalid limit parameter' });
        }
        const topProducts = await Product.aggregate([
            { $group: { _id: "$title", totalUnitsSold: { $sum: "$unitsSold" } } },
            { $sort: { totalUnitsSold: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).send({ message: `Top ${limit} products fetched successfully`, topProducts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { getTopProducts };
