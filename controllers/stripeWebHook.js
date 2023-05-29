const express = require('express');
const app = express();
const Order = require('../models/Order')
const Sale = require('../models/Sale'); // Import the Sale model

const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('./addStripePayment')

//Create order
const createOrder = async (customer, data)=> {
  const items = JSON.parse(customer.metadata.cart)

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    pamentIntentId: data.payment_intent,
    products: items,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
    customer: newCustomer
  })
  try {
   const savedOrder =  await newOrder.save()
   console.log('processed order:', savedOrder)

   // Create a new Sale based on the Order data
   const newSale = new Sale({
    userId: savedOrder.userId,
    orderId: savedOrder._id,
    total: savedOrder.total,
    // Include other relevant sale data here
  });

  const savedSale = await newSale.save();
  console.log('generated sale:', savedSale);
  } catch (error) {
    console.log(error)
  }
}
// This is your Stripe CLI webhook secret for testing your endpoint locally.
//const endpointSecret = "whsec_d35bf67d2b8c9ef7bee87fe0c353e76e045d58abc930079985445ae4bcfb2c35";
let endpointSecret;

const stripeWebhook = (request, response) => {
  const sig = request.headers['stripe-signature'];
  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log('webhook verified.')
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type
  } else {
    data = request.body.data.object;
    eventType = request.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers.retrieve(data.customer).then((customer) => {
      console.log(customer)
      console.log('data:', data)
      createOrder(customer, data)
    }).catch((error) => {
      console.log(error)
    })
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send().end;

};

module.exports = { stripeWebhook }
