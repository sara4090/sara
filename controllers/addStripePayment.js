require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);


//Creating a customer
const createCustomer = async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            email: req.body.email,
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

module.exports = {
    createCustomer,
    createIntent,
    attachPaymentMethod
}
