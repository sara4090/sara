const Order = require('../models/Order')

const orderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);
  
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(401).send({ message: "You are not authorized to update this order" });
    }

  
    order.status = status;
    await order.save();

    res.status(200).send({ message: "Order status updated...", order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { orderStatus }