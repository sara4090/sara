const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  paymentIntentId: { type: String },
  name: { type: String },
  email: { type: String },
  address: { type: Object },
  products: [
    {
      id: { type: String },
      name: { type: String },
      price: { type: Number },
      brand: { type: String },
      image: { type: String },
      quantity: { type: Number },
      desc: { type: String },
      mfr: { type: String },
      mfrNo: { type: String },

    }],
  date: { type: Date, default: Date.now(), required: true },
  amount_subtotal: { type: Number, },
  amount_total: { type: Number, },
  shipping: { type: Object, },
  delivery_status: { type: String, default: 'pending' },
  payment_status: { type: String, }
});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;