const Order = require('../models/Order');

const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    res.status(200).send({ message: "Total orders fetched successfully", totalOrders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { getTotalOrders };
