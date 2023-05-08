const User = require('../models/User')

const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete({ _id: id })
        res.status(200).json({ message: `Deleted customer with ID ${id}`, deleted_customer: user });


    } catch (error) {
        res.status(500).send({ error: error.message });
    }

}

module.exports = { deleteCustomer };