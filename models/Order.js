const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String },
  customerId: { type: String },
  paymentIntentId: { type: String },
  products: [
    {
      id: { type: String },
      name: { type: String },
      price: { type: Number },
      brand: { type: String },
      image: { type: String },
      quantity: { type: Number },
      desc: { type: String }

    }],
  date: { type: Date, default: Date.now(), required: true },
  subtotal: { type: Number, min: 0 },
  total: { type: Number, min: 0 },
  shipping: { type: Object, },
  delivery_status: { type: String, default: 'pending' },
  payment_status: { type: String, }




});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;