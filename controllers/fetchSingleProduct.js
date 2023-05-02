const Product = require('../models/Product');

const fetchSingleProduct = async (req, res) => {
    const productId = req.params.id
    try {
        const product = await Product.findById({_id: productId});
    
        if (!product) {
          return res.status(404).send({message: "Products not found"});
        }
         res.status(200).json({product});
      } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
      }
}
module.exports = { fetchSingleProduct }