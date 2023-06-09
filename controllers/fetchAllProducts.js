const Product = require('../models/Product');

const fetchProducts = async (req, res) => {
  const userId = req.user.id;
  try {
    const product = await Product.find({ user: userId });

    if (!product) {
      return res.status(404).send({ message: "Products not found" });
    }
    // console.log(product.user)
    // if (product.user !== req.user.id) {
    //   return res.status(401).send({ message: "You are not authorized" });
    // }
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}
module.exports = { fetchProducts }