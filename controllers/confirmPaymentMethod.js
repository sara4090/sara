require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

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
// Export payment method confirmation
module.exports = { confirmPaymentMethod };