const User = require('../models/User');

const deleteAccount = async (req, res) => {
    const userId = req.params.id;

    try {
      // check if user exists in database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      // delete user from database
      await User.findByIdAndDelete(userId);
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = { deleteAccount }