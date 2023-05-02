const Feedback = require("../models/Feedback");

const fetchFeedbacks = async (req, res) => {
  try {
    const feedback = await Feedback.find({});

    if (!feedback) {
      return res.status(404).send({message: "No feedback found..."});
    }

    return res.status(200).json({feedback});
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

module.exports = { fetchFeedbacks };