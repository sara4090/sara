const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const fetchSingleOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const userId = order.user;
    const user = await User.findById(userId);

    // const productIds = order.products.map((product) => product.productId);
    // const products = await Product.find({ _id: { $in: productIds } });

    return res.status(200).json({ order, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { fetchSingleOrder };
