const Subcategory = require('../models/Subcategory')
const { validationResult } = require('express-validator')
const Category = require('../models/Category')

const addSubCategory = async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ error: errors.array() })
        }

        const catId = req.params.id
        const checkCat = await Category.findById(catId)
        console.log(checkCat)
        if (checkCat) {
            const subCat = new Subcategory({
                catId: req.params.id,
                name: req.body.name,
                description: req.body.description
            });
            const checkSubCat = await Subcategory.findOne({ name: req.body.name });

            if (checkSubCat) {
                res.status(201).send({ message: 'Sub category already exists..' })
            }
           
            else {
                await subCat.save();
                res.status(200).send({ message: `Sub category ${subCat.name} is added to Category ${checkCat.name}`, checkCat, subCat })
            }
        }
        else{
            res.status(404).send({ message: 'Category not found' })
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { addSubCategory }