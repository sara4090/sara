const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
  
});

const BlogCategory = mongoose.model('blogCategories', categorySchema);

module.exports = BlogCategory;
