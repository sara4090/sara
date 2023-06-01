const Order = require('../models/Order');
const Sale = require('../models/Sale');
const stripe = require('stripe')(process.env.STRIPE_SECRET);


// Add Stripe Payment Method API
const addStripePaymentMethod = async (req, res) => {
  const { name, email, description, address } = req.body;

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
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    };
  });

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
    cancel_url: `http://localhost:3000/cart`
  });
  res.send({ url: session.url });

  //console.log(session);

  const eventType = req.body.eventType;
  if (eventType === 'checkout.session.completed') {
    // Create order
    const createOrder = async (data) => {
      const items = req.body.cartItems;

      const products = items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        mfr: item.mfr,
        mfrNo: item.mfrNo,
      }));

      const newOrder = new Order({
        userId: req.user.userId,
        pamentIntentId: data.payment_intent ? data.payment_intent.id : null,
        products: products,
        amount_subtotal: data.amount_subtotal,
        amount_total: data.amount_total,
        payment_status: data.payment_status,
        name: name,
        email: email,
        address: address,
      });

      const savedOrder = await newOrder.save();

      const newSale = new Sale({
        orderId: savedOrder._id,
        total: savedOrder.amount_total
      });

      const savedSale = await newSale.save();
      console.log('generated sale:', savedSale);

      console.log('Processed order:', savedOrder);
    };
    //res.send({session});
    const savedOrder = await createOrder(session);
    return (savedOrder);

    // const sessionUrl = session.url;
    // return res.json({ sessionUrl });

    // return res.send({ savedOrder });
  }

  res.send().end();
};

module.exports = { addStripePaymentMethod };
