const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    subcategories: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
  
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
