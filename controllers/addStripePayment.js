require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const addStripePaymentMethod =  async (req, res) => {
  try {
    const { cardNumber, expMonth, expYear, cvc, } = req.body;

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      },
    });

    res.status(200).json({ success: true, paymentMethod });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addStripePaymentMethod }
