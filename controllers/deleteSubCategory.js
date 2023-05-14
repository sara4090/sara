const Subcategory = require('../models/Subcategory');

const deleteSubCategory = async (req, res) => {

    try {
        const subCatId = req.params.id;
        const removeSubCat = await Subcategory.findByIdAndDelete({ _id: subCatId });
        console.log(removeSubCat);

        res.status(200).send({message: "Successfully removed subcategory",  removeSubCat });

        if (!removeSubCat) {
            return res.status(404).send({ message: "Sub categories not found" });
        }
        if (removeSubCat.user.toString() !== req.user.id) {
            return res.status(401).send({ message: "You are not authorized to delete this subcategory" });
        }


    } catch (error) {
         return res.status(500).send({ message: "Internal Server Error" });
    }
}
module.exports = { deleteSubCategory };