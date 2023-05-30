const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const fetchSingleOrder = async (req, res) => {
  const customerId = req.params.customerId;
  
  Order.find({ customerId })
    .then(orders => {
      res.json(orders);
    })
    .catch(error => {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'An error occurred while fetching orders' });
    });
};

module.exports = { fetchSingleOrder };