const Product = require('../models/Product');
const User = require('../models/User')
const Purchase = require('../models/Purchase')

const productRecomendations = async (req, res) => {
    try {
        const { userId } = req.body;
        const recommendedProducts = await recomendations(userId);
        if(recommendedProducts){ res.status(200).send({ recommendedProducts })}
        else{
            res.send({ message: 'Could not retrieve recommended products', error: error.message });

        }
       
    } catch (error) {
        res.status(500).send({message: 'Internal Server Error'});
    }
};

const recomendations = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const purchaseHistory = await Purchase.find({ userId });

    // Count the number of times each product has been purchased
    const purchaseCounts = {};
    purchaseHistory.forEach(purchase => {
        purchaseCounts[purchase.productId] = (purchaseCounts[purchase.productId] || 0) + 1;
    });

    // products purchase counts in descending order
    const sortedProducts = Object.entries(purchaseCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([productId]) => productId);

    // top 5 products
    const recommendedProducts = await Product.find({ _id: { $in: sortedProducts.slice(0, 5) } });

    return recommendedProducts;
    const products = await Product.find().sort({ price: -1 }).limit(5);
    return products;
}

module.exports = {
    productRecomendations
}