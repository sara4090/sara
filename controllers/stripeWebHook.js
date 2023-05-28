const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Sale = require('../models/Sale')
require('dotenv').config();

const productSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number,
  mfr: String,
  mfrNo: String,

});

const customerSchema = new Schema({
  customerId: String,
  name: String,
  address: String,
  metadata: {
    cart: String,
    userId: String,
    name: String
  },
  created_at:{
    type: Date,
    default: Date.now()
  }

});


const orderSchema = new Schema({
  userId: String,
  customerId: String,
  products: [productSchema],
  totalAmount: Number,
  price: Number,
  mfr: String,
  mfrNo: String,
  payment: {
    paymentIntentId: String,
    status: String
  },
  customer: [customerSchema]

});


const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Customer = mongoose.model('Customer', customerSchema);


const createOrder = async (customer, data) => {
  const items = JSON.parse(customer.metadata.cart);

  const products = items.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    mfr: data.mfr,
    mfrNo: data.mfrNo,

  }));

  const payment = {
    paymentIntentId: data.payment_intent,
    status: data.payment_status
  };
  console.log(payment)


  const newCustomer = new Customer({
    customerId: customer.id,
    name: customer.name || 'N/A',
    address: customer.address || 'N/A',
    metadata: {
      cart: customer.metadata.cart,
      userId: customer.metadata.userId,
      name: customer.metadata.name
    }
  });
  const savedCustomer = await newCustomer.save();

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    products: products,
    totalAmount: data.amount_subtotal,
    price: data.amount_total,
    mfr: data.mfr,
    mfrNo: data.mfrNo,
    payment: payment,
    customer: savedCustomer
  });

  try {


    const savedOrder = await newOrder.save();

    const newSale = new Sale({
      orderId: savedOrder._id,
    });

    const savedSale = await newSale.save();
    // console.log('Order saved:', savedOrder,savedCustomer );
    return { savedOrder, savedCustomer, savedSale };

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
      console.log('Customer Name:', customer.name);
      console.log('Customer Address:', customer.address);
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

module.exports = { stripeWebhook , Customer};