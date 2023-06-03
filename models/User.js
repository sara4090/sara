const mongoose = require('mongoose');
const { Schema } = require('mongoose')

const userShema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String
    },
    jobTitle: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true

    },
    country: {
        type: String,
        required: true

    },
    address: {
        type: String,
        required: true

    },
    is_admin: {
        type: Number,
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
    stripeCustomerId: {
        type: String,
        default: ''
    }
});
const User = mongoose.model('user', userShema);
module.exports = User;