const Sale = require('../models/Sale');

const getSalesPerMonth = async (req, res) => {
    try {
        const sales = await Sale.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    totalSales: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.status(200).json({ message: "Sales of this month", sales });
    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Internal server error'});
    }
};

module.exports = { getSalesPerMonth };
