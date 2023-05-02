const mongoose = require('mongoose')
const feedbackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = mongoose.model('feedback', feedbackSchema);
module.exports = Feedback;