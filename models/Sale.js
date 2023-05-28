const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
 
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
 
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
