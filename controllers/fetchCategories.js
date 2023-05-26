const Category = require('../models/Category')

const fetchCategories = async (req, res) => {
    try {
        const category = await Category.find({})
        console.log(category)

        // if (!category) {
        //     return res.status(404).send({ message: "No categories found." });
        // }
        res.status(200).json({ category });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { fetchCategories }