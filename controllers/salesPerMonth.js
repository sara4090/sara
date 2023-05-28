const Sale = require('../models/Sale');

const getSalesPerMonth = async (req, res) => {
    try {
        const { year, month } = req.query;

        const startDate = new Date(Date.UTC(year, month - 1, 1));
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(Date.UTC(year, month, 1));
        endDate.setUTCHours(0, 0, 0, 0);

        const sales = await Sale.find({
            saleDate: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        res.json(sales);
    } catch (error) {
        console.error('Error fetching monthly sales:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getSalesPerMonth };
