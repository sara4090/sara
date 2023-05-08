const Order = require("../models/Order");

const addOrder = async (req, res) => {
    let productId = req.params.id
    console.log(productId)
    try {


        const order = new Order({
            user: req.user.id,
            product: {
                productId: req.params.id,
                
                quantity: req.body.quantity,
                price: req.body.price 
            },
            totalAmount: req.body.totalAmount,
            paymentMethod: {
                paymentProvider:req.body.paymentProvider,
                cardNumber: req.body.cardNumber,
                expirationDate: req.body.expirationDate,
                cvv: req.body.cvv
            },
            userAddress: {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                secondNumber: req.body.secondNumber,
                pincode: req.body.pincode,
                area: req.body.area,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,

            },
            
        });
        await order.save();
        res.status(201).json({ message: "Order created successfully", order });

    } catch (error) {
        res.status(400).send({ error: error.message })


    }
}

module.exports = { addOrder }