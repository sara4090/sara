const Order = require('../models/Order');

const completedRecentOrders = async (req, res) => {
    try {
        const completedOrders = await Order.find({ status: 'completed' })
            .sort({ completedDate: -1 })
            .limit(10)
            .exec();
        res.json(completedOrders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

module.exports = { completedRecentOrders };
