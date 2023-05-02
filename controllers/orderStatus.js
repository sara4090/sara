const Order = require('../models/Order')

const orderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      res.status(200).send({message: "Order status updated...", order});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
} 
module.exports = { orderStatus }