const Product = require('../models/Product');

const searchProduct = async (req, res) => {
    try {
        const search = req.body.search;
        console.log(search)
        const searchProduct = await Product.find({
            "$or": [
                { name: { $regex: search } },
                { title: { $regex: search } }
            ]
        })

        console.log(searchProduct)

        if (searchProduct.length > 0) {
            res.status(200).send({ success: true, message: "Product details", data: searchProduct })
        }
        else { res.status(200).send({ success: true, message: "No product found." }) }

    } catch (error) {
        res.status(500).send({ message: error.message })
    };



};
module.exports = { searchProduct }