const User = require('../models/User');
const bcrypt = require('bcryptjs')

//Password Hashing
const hashedPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10)
    return hashed;
}

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const password = req.body.password;

        if (userId === '') {
            res.status(300).send({ success: false, message: "You can not update password..." })
        }

        else {

            const userData = await User.findOne({ _id: userId })

            if (userData) {
                const newPassword = await hashedPassword(password)
                const updated = await User.findByIdAndUpdate({ _id: userId }, {
                    $set: {
                        password: newPassword
                    }
                });
                res.status(200).send({ success: true, message: "Your password is updated successfully.." , newPassword: updated.password})

            }
            else {
                res.status(400).send({ success: false, message: "User not found" })
            }
        }



    } catch (error) {
        console.error(error)

    }
}

module.exports = { updatePassword }