const About = require('../models/About');

const getAboutUs = async (req, res) => {
    try {
        // Retrieve the latest company information from the database
        const company = await About.findOne().sort({ _id: -1 });
    
        if (!company) {
          res.status(404).json({ error: 'Nothing found :(' });
        } else {
          res.json(company);
        }
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }

}

module.exports = { getAboutUs }