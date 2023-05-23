const User = require('../models/User');

const updateUserInfo = async (req, res) => {
    try {
        const { email, name, phoneNumber, jobTitle, companyName, country, address } = req.body;
        const update = {};
        if (name) {
            update.name = name;
        }
        if (email) {
            update.email = email;
        }
        if (phoneNumber) {
            update.phoneNumber = phoneNumber;
        }

        if (jobTitle) {
            update.jobTitle = jobTitle;
        }
        if (companyName) {
            update.companyName = companyName;
        }
        if (country) {
            update.country = country;
        }
        if (address) {
            update.address = address;
        }

        const userData = User.findById(req.params._id).select("-password").select("-confirmPassword");
        console.log(req.params._id)
        if (!userData) {
            res.status(404).send('Data not found...')
        }

        const dataUpdate = await User.findByIdAndUpdate(req.params._id, { $set: update }, { new: true });
        res.status(200).send({
            message: "Updated Successfully",
            name: dataUpdate.name,
            email: dataUpdate.email,
            phoneNumber: dataUpdate.phoneNumber,
            jobTitle: dataUpdate.jobTitle,
            companyName: dataUpdate.companyName,
            country: dataUpdate.country,
            address: dataUpdate.address
        })

    } catch (error) {
        res.send({ error: error.message })
    }
}

module.exports = { updateUserInfo }