const mongoose = require('mongoose');
const emailSchema = mongoose.Schema({
    products: [{
        partNumber: { type: String, required: true },
        mfr: { type: String, required: true },
        qty: { type: String, required: true },
    }],
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String },
    country: { type: String, required: true },
    comment: { type: String, required: true },

});
const Email = new mongoose.model('email', emailSchema);
module.exports = Email;