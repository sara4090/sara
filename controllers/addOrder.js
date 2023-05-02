const Order = require("../models/Order");

const addOrder = async (req, res) => {
    try {


        const order = new Order({
            user: req.user.id,
            product: {
                id: req.params.productId,
                price: req.body.price 
            },
            totalAmount: req.body.totalAmount,
            quantity: req.body.quantity,
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