const Order = require('../models/Order');
const Sale = require('../models/Sale');
const router = require('../routes/userRoutes');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// Add Stripe Payment Method API
const addStripePaymentMethod = async (req, res) => {
  const { name, email, description, address, cartItems = [] } = req.body;

  // Create order
  const order = new Order({
    name,
    email,
    description,
    address,
    products: cartItems
  });
  console.log('order data',req.body, order);
  try {
    // Save order in the database
    const savedOrder = await order.save();

    const line_items = cartItems?.length > 0 && cartItems.map((item) => {
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
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      };
    });

    // Create a session with Stripe
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
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000`,
      cancel_url: `http://localhost:3000/cart`,
    });

    // Update the order with the session ID
    savedOrder.sessionId = session.id;
    console.log('saved order detail', savedOrder);
    await savedOrder.save();

    res.json({ id: session.id });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'An error occurred' });
  }
};

// router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
//   const event = request.body;

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log('PaymentIntent was successful!');
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       console.log('PaymentMethod was attached to a Customer!');
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.json({received: true});
// });

module.exports = { addStripePaymentMethod };
