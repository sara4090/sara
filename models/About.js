const mongoose = require('mongoose');
const aboutSchema = mongoose.Schema({
  name: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  images: [
    {
      public_id: {
        type: String,

      },
      url: {
        type: String,

      },
    },
  ],
  founders: [String],
  yearFounded: { type: Number }
})

const About = mongoose.model('about', aboutSchema);
module.exports = About;