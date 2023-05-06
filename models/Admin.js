const mongoose = require('mongoose');
const { Schema } = require('mongoose')

const adminSchema = new Schema({
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true
    },
    is_verified: {
        type: Number,
        required: true,
        default: 0
    },
    token: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    
});
const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;