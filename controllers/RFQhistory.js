const Email = require('../models/Email');

const RFQhistory = async (req, res) => {
    try {
        const history = await Email.find({});

        if (!history) {
            return res.status(404).send({ message: "No history found..." });
        }

        return res.status(200).json({ history });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = { RFQhistory }