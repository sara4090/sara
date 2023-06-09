const User = require('../models/User');
const Customer = require('../models/Customer')
const Order = require('../models/Order');
const Sale = require('../models/Sale');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('dotenv').config();


// Add Stripe Payment Method API
const addStripePaymentMethod = async (req, res) => {
  const loggedInUserId = req?.user?.id;
  let { stripeCustomerId = '' } = req.body;
  console.log('stripeCustomerId =====>', loggedInUserId, stripeCustomerId)
  if (!stripeCustomerId) {
    // fetch user details and create new customer if not exists
    stripeCustomerId = await createStripeCustomerIfNotExists(loggedInUserId);
  }

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
      customer: stripeCustomerId,
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/cart`,
      metadata: {
        cart: JSON.stringify(req?.body?.cartItems)
      }
    });

    console.log(session);
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
// Create order
const createOrder = async (data, customerId) => {
  console.log('data neer =>', customerId, JSON.parse(data.metadata.cart));
  const cartItems = JSON.parse(data.metadata.cart)

  const products = cartItems.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    mfr: data.mfr,
    mfrNo: data.mfrNo,
  }));

  const newOrder = new Order({
    userId: customerId,
    pamentIntentId: data?.payment_intent,
    products: products,
    amount_subtotal: data?.amount,
    amount_total: data?.amount_total,
    address: data?.shipping_details?.address,
    shipping: data?.shipping_details,
    payment_status: data?.paid ? 'paid' : 'pending'
  });

  const savedOrder = await newOrder.save();

  console.log('Processed order:', savedOrder);

  const newSale = new Sale({
    orderId: savedOrder._id,
    userId: customerId,
  });

  const savedSale = await newSale.save();
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

    data = req.body.data.object;
    eventType = req.body.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === 'checkout.session.completed') {
    try {
      const savedOrder = await createOrder(data, req?.user?.id);
      console.error('Saved Order webhook event:', savedOrder);

    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error", message: error.message });
    }
  }
  res.send({ Status: "Payment Successfully" });
};


// create stripe customer if not exists
const createStripeCustomerIfNotExists = async (loggedInUserId) => {
  try {
    console.log('userdetails =====>', loggedInUserId);
    const { name = '', email = '', address = '' } = await User.findById({ _id: loggedInUserId });
    console.log('userdetails =====>', name, email, address);
    const newStripeCustomer = await stripe.customers.create({
      name,
      email,
      description: 'created new user',
      address: {
        line1: address,
        postal_code: '300233',
        city: address,
        state: address,
        country: 'Pak'
      },
      metadata: {
        userId: loggedInUserId || '',
      }
    });
    // update this stripe customer id to logged in user in db    
    await User.updateOne({ email: email }, { $set: { stripeCustomerId: newStripeCustomer.id } })
    console.log("savedCustomer", newStripeCustomer);

    const customerTosave = new Customer(newStripeCustomer);
    const savedCustomer = await customerTosave.save()
    return newStripeCustomer.id;

  } catch (excp) {
    console.log('excp', excp);
  }
}


module.exports = { addStripePaymentMethod, stripeWebhook };