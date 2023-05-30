const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('../models/Order')
const Sale = require('../models/Sale'); 

const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('./addStripePayment')

const productSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number,
  mfr: String,
  mfrNo: String,

});
const paymentSchema = new Schema({
  paymentIntentId: String,
  status: String,
});


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
     payment: [paymentSchema]
    
  });
  try {
   const savedOrder =  await newOrder.save()
   console.log('Processed order:', savedOrder)

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

const stripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('webhook verified.')
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
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

  // Return a 200 res to acknowledge receipt of the event
  res.send().end;

};

module.exports = { stripeWebhook }
