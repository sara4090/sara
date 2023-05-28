const { Customer } = require('./stripeWebHook')
const moment = require('moment');


const customerLastFewMonths = async (req, res) => {
    try {
        // Calculate the date 3 months ago
        const threeMonthsAgo = moment().subtract(3, 'months').toDate();

        // Retrieve customers created in the last 3 months
        const customers = await Customer.find({
            created_at: { $gte: threeMonthsAgo },
        });

        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}
module.exports = { customerLastFewMonths }