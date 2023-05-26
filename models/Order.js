const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  customerId: { type: String },
  paymentIntentId: { type: String },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      // required: true
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, },
    mfr: { type: Object, },
    mfrNo: { type: Number, }
  }],
  date: { type: Date, default: Date.now, required: true },
  totalAmount: { type: Number, min: 0 },
  paymentMethod: [{
    paymentProvider: { type: String, },
    cardNumber: { type: String, },
    expirationDate: { type: String, },
    cvv: { type: String, }
  }],

  address: [
    {
      name: { type: String, },
      phoneNumber: { type: String, },
      secondNumber: { type: String },
      pincode: { type: String, },
      area: { type: String, },
      city: { type: String, },
      state: { type: String, },
      country: { type: String, }
    }]
  ,
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  }

});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;