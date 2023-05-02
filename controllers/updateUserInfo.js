const User = require('../models/User');

const updateUserInfo = async (req, res) => {
    try {
        const {email, name, phoneNumber, telePhone, jobTitle, companyName, country, address } = req.body;
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
        if (telePhone) {
            update.telePhone = telePhone;
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

        const userData = User.findById(req.params._id);
        console.log(req.params._id)
        if (!userData) {
            res.status(404).send('Data not found...')
        }

        const dataUpdate = await User.findByIdAndUpdate(req.params._id, { $set: update }, { new: true });
        res.status(200).send({ dataUpdate })

    } catch (error) {
        res.send({ error: error.message })
    }
}

module.exports = { updateUserInfo }