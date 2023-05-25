const mongoose = require('mongoose');
const { Schema } = mongoose;
const blogSchema =  Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    title: { type: String, required: true },
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
    description: { type: String, required: true },

    author: { type: String, default: "Anonymous", required: true },
    date: { type: Date, default: Date.now, required: true },

});
const Blog = new mongoose.model('blog', blogSchema);
module.exports = Blog;