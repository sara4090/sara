
//ADDING PRODUCT TO CART
const cart = [];
const addToCart = (req, res) => {
    const { productId, name, price, quantity } = req.body;
    try {

        const productIndex = cart.findIndex(product => product.productId === productId);

        if (productIndex === -1) {
            cart.push({ productId, name, price, quantity: Number(quantity) });
        } else {
            cart[productIndex].quantity += Number(quantity);
        }

        let totalAmount = 0;
        for (let i = 0; i < cart.length; i++) {
            totalAmount += cart[i].price * cart[i].quantity;
        }

        res.status(200).send({ message: 'Product added to cart', cart, totalAmount });
        console.log(cart)
    }
    catch (error) {
        res.status(400).send({ error: error.message })

    }
}

//REMOVING PRODUCT FROM CART
const removeFromCart = (req, res) => {
    const productId = req.params.productId;
    try {

        const productIndex = cart.findIndex(product => product.productId === productId);

        if (productIndex === -1) {
            res.status(404).json({ message: 'Product not found in cart' });
        } else {
            const product = cart[productIndex];
            if (product.quantity > 1) {
                product.quantity--;
            } else {
                cart.splice(productIndex, 1);
            }

            let totalAmount = 0;
            for (let i = 0; i < cart.length; i++) {
                totalAmount += cart[i].price * cart[i].quantity;
            }

            res.status(200).send({ message: 'Product removed from cart', cart, totalAmount });
        }
    } catch (error) {
        res.status(400).send({ error: error.message })

    }

}

//FETCHING CURRENT CART STATUS
const fetchCartStatus = (req, res) => {
    try {
        let totalAmount = 0;
        for (let i = 0; i < cart.length; i++) {
            totalAmount += cart[i].price * cart[i].quantity;
        }

        res.status(200).send({ cart, totalAmount });
    } catch (error) {
        res.status(400).send({ error: error.message })

    }

}

module.exports = { addToCart, removeFromCart, fetchCartStatus }
