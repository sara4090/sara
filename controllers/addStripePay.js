const app = require('express')();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

//CREATING PAYMENT INTENT
const createPaymentIntent = async (req, res) => {
    const { amount, currency, description, source } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            description,
            payment_method: source,
            confirm: true,
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: error.message });
    }
}
//ADD PAYMENT METHOD


//HANDLING PAYMENT STATUS
const handlePaymentStatus = async (req, res) => {
    const event = req.body;

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object);
        break;
      default:
        // Handle other event types
        console.log('Received event:', event);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
  }

  res.sendStatus(200);
}

module.exports= { createPaymentIntent, handlePaymentStatus };