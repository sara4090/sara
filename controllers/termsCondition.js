const fs = require('fs')
const dataFilePath = './terms.json';

const getTermsConditions =async (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
          res.status(500).json({ error: 'Unable to retrieve terms and conditions' });
          return;
        }
    
        const termsData = JSON.parse(data);
        console.log(termsData)
        res.json(termsData);
      });
}


const termsContions = (req, res) => {
    const { content } = req.body;

  // Check if the content field is provided
  if (!content) {
    res.status(400).json({ error: 'Missing required field: content' });
    return;
  }

  const updatedTermsData = { content };

  fs.writeFile(dataFilePath, JSON.stringify(updatedTermsData), 'utf8', (err) => {
    if (err) {
      res.status(500).json({ error: 'Unable to update terms and conditions' });
      return;
    }

    res.json(updatedTermsData);
  });
}

module.exports = { getTermsConditions, termsContions }