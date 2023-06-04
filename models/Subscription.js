const mongoose = require('mongoose');
const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(),
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;