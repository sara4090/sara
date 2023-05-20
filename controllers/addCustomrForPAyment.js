require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);


//Creating a customer
const createCustomer = async (req, res) => {
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
    res.status(200).send({ customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Generating setup intent
const createIntent = async (req, res) => {
  try {
    const intent = await stripe.setupIntents.create({
      customer: req.body.customerId,
    });
    res.status(200).send({ customerSecret: intent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//Attach payment method to the customer
const attachPaymentMethod = async (req, res) => {
  try {
    const intent = await stripe.setupIntents.retrieve(req.body.clientSecret);
    const paymentMethod = intent.payment_method;

    const paymentMethodAdded = await stripe.paymentMethods.attach(paymentMethod, {
      customer: req.body.customerId,
    });

    res.status(200).send({ message: 'Payment method added successfully', paymentMethodAdded });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Payment method confirmation
const confirmPaymentMethod = async (req, res) => {
  try {
    // Validate request data
    const { paymentMethodId, customerId } = req.body;
    if (!paymentMethodId || !customerId) {
      return res.status(400).json({ error: 'Payment method ID and customer ID are required.' });
    }

    // Retrieve customer from Stripe
    const customer = await stripe.customers.retrieve(customerId);

    // Confirm the payment method
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Update customer's default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Send response
    res.json({ message: 'Payment method confirmed successfully.' });
  } catch (error) {
    console.error('Error confirming payment method:', error);
    res.status(500).json({ error: 'An error occurred while confirming the payment method.' });
  }
}


module.exports = {
  createCustomer,
  createIntent,
  attachPaymentMethod,
  confirmPaymentMethod
}
