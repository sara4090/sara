
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const addStripePaymentMethod = async (req, res) => {
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "USD",
        product_data: {
          name: item.name,
          images: [item.images],
          description: item.desc,
          metadata: {
            id: item.id
          },
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }
  });
  try {
    const session = await stripe.checkout.sessions.create({
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
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`

    });
    res.send({ url: session.url })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addStripePaymentMethod }
