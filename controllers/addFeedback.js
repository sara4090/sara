const Feedback = require('../models/Feedback');
const addFeedback = async (req, res) => {
    try {
        const feedback = new Feedback({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            user: req.user.id 

        });
        await feedback.save();
        res.status(201).send({message: "Thanks for your feedback", feedback });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}
module.exports = { addFeedback }