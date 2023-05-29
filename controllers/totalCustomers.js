const Customer = require('../models/Customer')

const totalCustomers = async (req, res) => {
    try {
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

        const query = { created_at: { $gte: fourMonthsAgo } };

        const totalCustomers = await Customer.countDocuments(query);

        res.status(200).json({ totalCustomers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = { totalCustomers }