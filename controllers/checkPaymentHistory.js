const Payment = require('../models/Payment');

const checkPaymentHistory = async (req, res) => {
    const { userId } = req.query;
    try {
        const payments = await Payment.find({ userId });
        res.status(200).send({ message: "Payment history found", payments });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { checkPaymentHistory };
