// Stripe Webhook API
const addStripePaymentMethod = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let data;
  let eventType;

  let endpointSecret;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('webhook verified.');
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === 'checkout.session.completed') {
    try {
      // Retrieve the customer's cart items
      const cartItems = JSON.parse(data.metadata.cart);

      // Create order
      const createOrder = async (data) => {
        const products = cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          mfr: item.mfr,
          mfrNo: item.mfrNo,
        }));

        const newOrder = {
          user: req.user.id,
          userId: data.metadata.userId,
          paymentIntentId: data.payment_intent,
          products: products,
          amount_subtotal: data.amount_subtotal,
          amount_total: data.amount_total,
          shipping: data.shipping.address,
          payment_status: data.payment_status,
        };

        // Save the order to the database or perform any other necessary actions
        console.log('Processed order:', newOrder);
        return newOrder;
      };

      const processedOrder = await createOrder(data);

      return res.send({ order: processedOrder });
    } catch (error) {
      console.error('Error handling webhook event:', error.message);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.send().end();
};

module.exports = { addStripePaymentMethod };
