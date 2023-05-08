const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  amount: {
    type: Number,
    // required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
