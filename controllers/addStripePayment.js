const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Sale = require('../models/Sale');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Add Stripe Payment Method API
const addStripePaymentMethod = async (req, res) => {
  const { name, email, description, address } = req.body;

  const customer = await stripe.customers.create({
    name,
    email,
    description,
    address,
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItems)
    }
  });

  const newCustomer = new Customer(customer);
  const savedCustomer = await newCustomer.save();
  console.log(customer.id);

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
      customer: customer.id,
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000`,
      cancel_url: `http://localhost:3000/cart`
    });

    res.send({url: session.url });
    console.log(session);
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: error.message });
  }
};

// Stripe Webhook API
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let data;
  let eventType;

  let endpointSecret;

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

  // Handle the event
  if (eventType === 'checkout.session.completed') {
    try {
      const customer = await stripe.customers.retrieve(data.customer);
      const newCustomer = new Customer(customer)
      await newCustomer.save()

      // Create order
      const createOrder = async (customer, data) => {
        const items = JSON.parse(customer.metadata.cart);

        const products = items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          mfr: data.mfr,
          mfrNo: data.mfrNo,
        }));

        const newOrder = new Order({
          userId: customer.metadata.userId,
          customerId: data.customer,
          pamentIntentId: data.payment_intent,
          products: products,
          amount_subtotal: data.amount_subtotal,
          amount_total: data.amount_total,
          shipping: customer.adress,
          payment_status: data.payment_status,
          customer: customer

        });

        const savedOrder = await newOrder.save();

        const newSale = new Sale({
          userId: savedOrder.userId,
          orderId: savedOrder._id,
          total: savedOrder.total
        });

        const savedSale = await newSale.save();
        console.log('generated sale:', savedSale);

        console.log('Processed order:', savedOrder);
        return savedOrder

      };

      const savedOrder = await createOrder(customer, data);
      
      return res.send({ savedOrder });

    } catch (error) {
      console.error('Error handling webhook event:', error.message);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.send().end();
};


module.exports = { addStripePaymentMethod, stripeWebhook };