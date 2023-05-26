const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const fetchSubCategories = async (req, res) => {

    try {
        const catId = req.params.id;
        const checkCat = await Category.findById(catId);
        console.log(checkCat);

        if (!checkCat) {
            return res.status(404).send({ error: 'Category not found' });

        }
        else {
            const subcategories = await Subcategory.find({ catId })
            res.status(200).send({ subcategories })
            if (subcategories.catId) {

            }
           


        }



    } catch (error) {
        console.error(error);
        //return res.status(500).send({ message: "Internal Server Error" });
    }
}
module.exports = { fetchSubCategories }