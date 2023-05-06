const express = require('express');
const app = express();
const csv = require('fast-csv');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define MongoDB schema
const mySchema = new Schema({
  name: String,
  age: Number,
  email: String
});

// Define MongoDB model
const MyModel = mongoose.model('MyModel', mySchema);

// Define API route to import CSV data
app.post('/import-csv', async (req, res) => {
  // Load CSV data
  const stream = fs.createReadStream('path/to/csv-file.csv');
  const rows = [];

  // Parse CSV data into JSON format
  csv.parseStream(stream, { headers: true })
    .on('data', (row) => {
      rows.push(row);
    })
    .on('end', async () => {
      // Map JSON data to MongoDB schema and insert into database
      for (let row of rows) {
        const data = {
          name: row.name,
          age: row.age,
          email: row.email
        };
        await MyModel.create(data);
      }
      res.send('Import successful');
    });
});

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  // Start API server
  app.listen(3000, () => {
    console.log('API server running on port 3000');
  });
}).catch((err) => {
  console.log('MongoDB connection error', err);
});
