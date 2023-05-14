const Category = require('../models/Category');

const deleteCategory = async (req, res) => {

    try {
        const catId = req.params.id;
        const removeCat = await Category.findByIdAndDelete({ _id: catId });
        console.log(removeCat);

        res.status(200).send({message: "Successfully removed category",  removeCat });

        if (!removeCat) {
            return res.status(404).send({ message: "Category not found" });
        }
        if (removeCat.user.toString() !== req.user.id) {
            return res.status(401).send({ message: "You are not authorized to delete this category" });
        }


    } catch (error) {
         return res.status(500).send({ message: "Internal Server Error" });
    }
}
module.exports = { deleteCategory };