const Order = require('../models/Order')

const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $sort: { date: -1 } }
        ])
        console.log(recentOrders);
        res.status(200).json({ recent_orders: recentOrders })

    } catch (error) {
        res.status(500).send({ error: error.message });
    }

}

module.exports = { getRecentOrders }