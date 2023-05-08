const Order = require("../models/Order");

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id.toString();
    const order = await Order.findByIdAndDelete({ _id: orderId });

    if (!order) {
      return res.status(404).send({meassage: "No order found"});
    }
    if(order.user.toString() !== req.user.id){
      return res.status(401).send({message: "You are not authorized to delete this order"});
  }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { deleteOrder };