const Category = require('../models/Category')
const { validationResult } = require('express-validator')

const addCategory = async (req, res) => {

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ error: errors.array() })
        }

        const { name, description } = req.body;

        const category = await Category({ name, description })

        const userdata = await Category.findOne({ name: req.body.name });

        if (userdata) {
            res.status(201).send({ message: 'Category already exists..' })
        }
        else {
            await category.save()
            res.status(200).send({ message: "Category added", category })
        }
    } catch (error) {
        res.status(400).send({ error: error.message })

    }
}

module.exports = { addCategory }