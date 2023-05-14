const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'pending', 'failed'],
        required: true,
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card'],
    },
    cardDetails: {
        cardHolderName: { type: String },
        cardNumber: { type: String },
        cvv: { type: String },
        valid: { type: String },

    },


    date: {
        type: Date,
        default: Date.now
    },
    transaction_id: {
        type: String,
        // required: true
    },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
