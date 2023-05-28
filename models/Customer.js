const mongoose = require('mongoose');
const customerSchema = mongoose.Schema({

    customerId: String,
    name: { type: String },
    address: { type: String },
    metadata: {
        cart: String,
        userId: String,
        name: String
    },
    created_at: {
        type: Date,
        default: Date.now()
    }

});

const Customer = mongoose.model('customer', customerSchema);
module.exports = Customer;