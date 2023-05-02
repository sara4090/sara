const Product = require('../models/Product');
const favorites = new Set();

const addToFavourite = async (req, res) => {
  const  productId  = req.params.id;
  if (!productId) {
    return res.status(400).json({ error: 'Product nott found' });
  }
  let item = favorites.add(productId);
  console.log(item)
  return res.json({ success: true, message: "Product added to favourite list", item});

};

//Delete from favorite list
const deleteFromFavorite = async (req, res) => {
  const  productId  = req.params.id;
  if (!productId) {
    return res.status(400).json({ error: 'Product not foundt' });
  }
  let item = favorites.delete(productId);
  console.log(item)

  return res.json({ success: true, message:"Product removed from list", item });

}

module.exports = { addToFavourite, deleteFromFavorite }