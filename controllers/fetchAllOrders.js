const Order = require("../models/Order");

const fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders) {
      return res.status(404).send({message: "No orders found..."});
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports = { fetchAllOrders };