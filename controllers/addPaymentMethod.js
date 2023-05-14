const Payment = require('../models/Payment');

const addPaymentMethod = async (req, res) => {

    try {
        const { paymentMethod, amount , cardDetails} = req.body;



        if (cardDetails?.cardNumber || cardDetails?.cvv) {
            const existingCard = await Payment.findOne({
                "cardNumber":
                   cardDetails?.cardNumber,
            });
            if (existingCard) {
                return res.status(400).json({ message: "Card number already exists." });
            }

            const existingCvv = await Payment.findOne({
                "cvv": cardDetails?.cvv,
            });
            if (existingCvv) {
                return res.status(400).json({ message: "CVV already exists." });
            }
        }

        const payment = new Payment({
            user: req.user.id,
            paymentMethod,
            cardDetails: {
                cardHolderName: req.body.cardHolderName,
                cardNumber: req.body.cardNumber,
                cvv: req.body.cvv,
                valid: req.body.valid

            },

            amount


        });

        await payment.save();
        return res.status(200).send({ message: "Payments method created successfully", payment });

    } catch (error) {
        console.log(error);

    };
}
module.exports = { addPaymentMethod }