const Sale = require('../models/Sale');

const getSalesPerMonth = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getUTCFullYear();
        const currentMonth = currentDate.getUTCMonth();
    
        const sales = await Sale.find({
          saleDate: {
            $gte: new Date(Date.UTC(currentYear, currentMonth - 2, 1, 0, 0, 0, 0)),
            $lt: new Date(Date.UTC(currentYear, currentMonth + 1, 1, 0, 0, 0, 0)),
          },
        });
    
        res.json(sales);
      } catch (error) {
        console.error('Error fetching sales for the last three months:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

module.exports = { getSalesPerMonth };
