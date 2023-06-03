const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Sale = require('../models/Sale');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Add Stripe Payment Method API
const addStripePaymentMethod = async (req, res) => {
  const { name, email, description, address, stripeCustomerId = '' } = req.body;
  let stripeCustomerIdParam=stripeCustomerId;
  console.log('stripeCustomerId', stripeCustomerId, !stripeCustomerId, req.body)
  if (!stripeCustomerId) {
    // fetch user details and create new customer if not exists
    const savedCustomer = await stripe.customers.create({
      name: "seerat test1",
      email: "kumar@gmail.com",
      description: 'tst',
      address: "",
      metadata: {
        userId: "2131",
        cart: JSON.stringify(req?.body?.cartItems)
      }
    });
    stripeCustomerIdParam= savedCustomer.id;
    console.log("savedCustomer", savedCustomer);
  }

  console.log('customer',stripeCustomerIdParam, 'cus_O0rEBGjhf1ZtoU');

  const line_items = req.body.cartItems.map((item) => {
    const images = Array.isArray(item.images) ? item.images : [item.images];
    const customFields = {
      mfr: item.mfr,
      mfrNo: item.mfrNo
    };

    return {
      price_data: {
        currency: "USD",
        product_data: {
          name: item.name,
          images: images,
          description: item.desc,
          metadata: {
            id: item.id,
            ...customFields
          }
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['IN', 'PK', 'NP']
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd'
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5
              },
              maximum: {
                unit: 'business_day',
                value: 7
              }
            }
          }
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd'
            },
            display_name: 'Next day air',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1
              },
              maximum: {
                unit: 'business_day',
                value: 1
              }
            }
          }
        }
      ],
      phone_number_collection: {
        enabled: true
      },
      billing_address_collection: 'required',
      customer: stripeCustomerIdParam,
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/cart`,
      cancel_url: `http://localhost:3000/cart`
    });

    console.log(session);
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: error.message });
  }
};
// Create order
const createOrder = async (customerId, data) => {
  console.log('data =>', data, customerId);
  const cartItems= [
    {
      name: 'Product 1',
      price: 19,
      quantity: 2,
      images: [Array],
      desc: 'Product 1 description',
      id: '123456',
      mfr: 'Manufacturer 1',
      mfrNo: 'ABC123'
    }
  ];

  const products = cartItems.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    mfr: data.mfr,
    mfrNo: data.mfrNo,
  }));

  const newOrder = new Order({
    userId: "646a0ca6d922dc5557f09f75", // need to be change as per given obj
    pamentIntentId: data.payment_intent,
    products: products,  // need to be change as per given obj
    amount_subtotal: data?.amount,
    amount_total: data?.amount_total,
    shipping: data.shipping.adress,
    payment_status: data.payment_status
  });
  console.log('test with webhook', newOrder);

  const savedOrder = await newOrder.save();

  const newSale = new Sale({
    userId: customerId,
    orderId: savedOrder._id,
    total: savedOrder?.total || 0
  });

  const savedSale = await newSale.save();
  console.log('generated sale:', savedSale);

  console.log('Processed order:', savedOrder);
  return savedOrder
};

// Stripe Webhook API
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let data;
  let eventType;
console.log('req.body', req.body);
  const endpointSecret = "";

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('webhook verified.');
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  const customer = await stripe.customers.retrieve(data.customer);

  console.error('Saved customer ===>:', customer);
  // Handle the event
  if (eventType === 'checkout.session.completed') {
    try {
      const savedOrder = await createOrder(customer, data);

      console.error('Saved Order webhook event:', savedOrder);

    } catch (error) {
      console.error('Error handling webhook event:', error.message);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.send().end();
};


module.exports = { addStripePaymentMethod, stripeWebhook };