const mongoose = require('mongoose');
const subCatSchema = new mongoose.Schema({
   catId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
   },
    name: {
        type: 'String',
        required: true
    },
    description: {
        type: 'String',
    },
});
const Subcategory =new mongoose.model('Subcategory', subCatSchema);
module.exports = Subcategory;