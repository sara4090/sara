const mongoose = require('mongoose');
const customerSchema = mongoose.Schema({
    name: {
        type: 'string',
    },
    created_at: {
        type: 'date',
        default: Date.now
    }
});

const Customer = mongoose.model('customer', customerSchema);
module.exports = Customer;