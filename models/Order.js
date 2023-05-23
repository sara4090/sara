const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerId: { type: String },
  paymentIntentId: { type: String },
  product: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, }
  }],
  date: { type: Date, default: Date.now, required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: [{
    paymentProvider: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    cvv: { type: String, required: true }
  }],

  userAddress: [
    {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      secondNumber: { type: String },
      pincode: { type: String, required: true },
      area: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    }
  ],
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  }

});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;