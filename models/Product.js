const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
  },
  title: {
    type: String,

  },
  category: {
    type: String,
  },
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    },
  ],
  description: {
    type: String
  },
  price: {
    type: String
  },
  brand: {
    type: String
  },
  inventory: {
    type: String
  },
  stock: {
    type: String
  },
  material: {
    type: String
  },
  ram: {
    type: String
  },
  storage: {
    type: String
  },
  color: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }

})
productSchema.add({
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

const Product = mongoose.model('product', productSchema)
module.exports = Product;