const mongoose = require('mongoose');

const product = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    price: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    
     product: [product],
    quantity: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
      },
    date: {
        type: Date,
        default: Date.now
    },

    userAddress: {
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

});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;