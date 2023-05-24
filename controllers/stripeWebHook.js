const Order = require('../models/Order');
require('dotenv').config();

const createOrder = async (customer, data) => {
  const items = JSON.parse(customer.metadata.cart);

  const products = items.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  const payment = {
    paymentIntentId: data.payment_intent,
    status: data.payment_status
  };

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    products: products,
    totalAmount: data.amount_subtotal,
    price: data.amount_total,
    mfr: data.mfr,
    mfrNo: data.mfrNo,
    payment: payment
  });

  try {
    const savedOrder = await newOrder.save();
    console.log('Order saved:', savedOrder);
    return savedOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};


const stripe = require('stripe')(process.env.STRIPE_SECRET);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret = "whsec_d35bf67d2b8c9ef7bee87fe0c353e76e045d58abc930079985445ae4bcfb2c35";

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('Webhook verified');
    } catch (err) {
      console.error('Webhook verification error:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === 'checkout.session.completed') {
    try {
      const customer = await stripe.customers.retrieve(data.customer);
      console.log('Customer:', customer);
      console.log('Data:', data);
      const savedOrder = await createOrder(customer, data);
      return res.json(savedOrder);
    } catch (error) {
      console.error('Error handling webhook event:', error.message);
      return res.status(500).send('Internal Server Error');
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};

module.exports = { stripeWebhook };
