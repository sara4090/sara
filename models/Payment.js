const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'pending', 'failed'],
        required: true
    },
    payment_method: {
        type: String,
        enum: ['credit_card', 'debit_card'],
        credit_card: {
            card_number: { type: String },
            cvv: { type: String },
            valid: { type: Date },
        },
        debit_card: {
            card_number: { type: String },
            cvv: { type: String },
            valid: { type: Date },
        },

        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    transaction_id: {
        type: String,
        required: true
    },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
