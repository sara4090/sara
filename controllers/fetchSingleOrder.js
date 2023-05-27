const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const fetchSingleOrder = async (req, res) => {
  try {
    
    const order = await Order.findById({ _id: req.params.id.toString() });
    console.log(order)

    if (!order) {
      return res.status(404).send({message: "Order not found"});
    }

    const userId = order.user;
    if (!userId) {
      return res.status(404).send({messagw: "User not found"});
    }
    const user = await User.findById({ _id: userId });

    const productIds = order.products.map((product) => product.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    return res.status(200).json({ order, user, products });
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports = { fetchSingleOrder };
