const Order = require('../models/Order')
require('dotenv').config();

const createOrder = async (customer, data) => {
    const items = JSON.parse(customer.metadata.cart);

    const newOrder = new Order({
        userId: customer.metadata.userId,
        customerId: data.customer,
        paymentIntentId: data.payment_intent,
        products: items,
        totalAmount: data.amount_subtotal,
        price: data.amount_total,
        mfr: data.mfr,
        mfrNo: data.mfrNo,
        payment_status: data.payment_status


    });
    try {
        const savedOrder = await newOrder.save();
        //res.json(savedOrder);
        //console.log(savedOrder);
        console.log(data.mfrNo);
        console.log(items);

    } catch (error) {
        console.log(error)
    }

};


const stripe = require('stripe')(process.env.STRIPE_SECRET);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
//endpointSecret = "whsec_d35bf67d2b8c9ef7bee87fe0c353e76e045d58abc930079985445ae4bcfb2c35";

const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];


    let data;
    let eventType;

    if (endpointSecret) {

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log('webhook verified')
        } catch (err) {
            console.log(`Webhook Error: ${err.message}`)
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        data = event.data.object;
        eventType = event.type;
    }
    else {
        data = req.body.data.object;
        eventType = req.body.type;
    }


    // Handle the event
    if (eventType === "checkout.session.completed") {
        try {
            const customer = await stripe.customers.retrieve(data.customer);
            console.log(customer);
            console.log('Data:', data);
            const savedOrder = await createOrder(customer, data);
            res.json(savedOrder);

        } catch (error) {
            console.error(error.message);
            // res.status(500).send('Internal Server Error');
        }
    }


    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
};

module.exports = { stripeWebhook }