require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const addStripePaymentMethod = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      source: req.body.stripeToken,
      address: {
        line1: req.body.line1,
        line2: req.body.line2,
        postal_code: req.body.postal_code,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country

      }
    });
    const charge = await stripe.charges.create({
      amount: req.body.amount * 100,
      description: req.body.productName,
      currency: 'USD',
      customer: customer.id,
    });
    res.status(200).send({ customer, charge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addStripePaymentMethod }
