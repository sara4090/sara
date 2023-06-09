const dataFilePath = './privecy.json';
const fs = require('fs')

const getPrivecy = async (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
          res.status(500).json({ error: 'Unable to retrieve privacy policy' });
          return;
        }
    
        const privacyData = JSON.parse(data);
        res.json(privacyData);
      });

}

const privecyPolicy = async (req, res) => {
    const { content } = req.body;

  // Check if the content field is provided
  if (!content) {
    res.status(400).json({ error: 'Missing required field: content' });
    return;
  }

  const updatedPrivacyData = { content };

  fs.writeFile(dataFilePath, JSON.stringify(updatedPrivacyData), 'utf8', (err) => {
    if (err) {
      res.status(500).json({ error: 'Unable to update privacy policy' });
      return;
    }

    res.json(updatedPrivacyData);
  });
}

module.exports = { getPrivecy, privecyPolicy}