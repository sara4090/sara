const Order = require('../models/Order')

const adminOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        res.status(200).send({ message: "Order status updated...", order_status: order });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
module.exports = { adminOrderStatus }