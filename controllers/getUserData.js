const User = require('../models/User');

const getUserData = async (req, res) => {
    try {
         let id =  req.params.id.toString()
        console.log(id)

         let user = await User.findById({ _id: id })
         if (!user) {
            // Handle case where user data is not found
            return res.status(401).json({ message: 'Unauthorized' });
          }

        res.status(200).send({ user })

    } catch (error) {
        res.send({ erreor: error.message })

    }
}
module.exports = { getUserData }