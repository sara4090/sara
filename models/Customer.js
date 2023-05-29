const mongoose = require('mongoose');
const customerSchema = mongoose.Schema({

    customerId: String,
    name: { type: String },
    address: {
        line1: { type: String },
        line2:{ type: String },
        city: { type: String },
        state: { type: String },
        postal_code:{ type: String },
        country: { type: String }
      },
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