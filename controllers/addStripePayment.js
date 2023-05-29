const Customer = require('../models/Customer')
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const addStripePaymentMethod = async (req, res) => {
  const { name, email, description, address } = req.body;

  const customer = await stripe.customers.create({
    name,
      email,
      description,
      address,
    });

    const savedCustomer = new Customer(customer)
    const newCustomer = savedCustomer.save();
console.log(customer.id)  
  res.json(customer);

  const line_items = req.body.cartItems.map((item) => {
    const images = Array.isArray(item.images) ? item.images : [item.images];
   // console.log(req.body.cartItems)
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
          },

        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }
  });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['IN', 'PK', 'NP'],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Next day air',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',

      customer: customer.id,
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000`,
      cancel_url: `http://localhost:3000/cart`

    });
    res.send({ url: session.url })
    console.log(session)

  } catch (error) {
    //res.status(500).json({ error: error.message });
  }

};


module.exports = { addStripePaymentMethod }