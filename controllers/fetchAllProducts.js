const Product = require('../models/Product');

const fetchProducts = async (req, res) => {
    try {
        const products = await Product.find({}).limit(10);
    
        if (!products) {
          return res.status(404).send({message: "Products not found"});
        }
         res.status(200).json({products});
      } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
      }
}
module.exports = { fetchProducts }