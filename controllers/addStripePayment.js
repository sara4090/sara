const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Sale = require('../models/Sale');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('dotenv').config();


const createPaymentIntent = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return paymentIntent.client_secret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Add Stripe Payment Method API
const addStripePaymentMethod = async (req, res) => {
  try {
    const clientSecret = await createPaymentIntent();
    res.json({ clientSecret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//process method 
const processPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const paymentResult = await stripe.paymentIntents.confirm(paymentIntent.id);
    return paymentResult;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};
//process method API
const confirmPayment = async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    const paymentResult = await processPayment(paymentIntentId);
    res.json({ paymentResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = { addStripePaymentMethod, confirmPayment };