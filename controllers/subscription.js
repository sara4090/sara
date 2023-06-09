const { eventNames } = require('../models/Sale');
const Subscription = require('../models/Subscription')

//Addibg subscription
const addSubscription = async (req, res) => {
    const { email, name } = req.body;

    if (!email || !eventNames) {
        return res.status(400).json({ error: 'Email and plan are required' });
    }
    try {
        const subscription = await Subscription.findOne({ email });
        if (subscription) {
            res.json({ message: "Already subscribed " })
        }

        const newSubscription = new Subscription({ email, name });

        const savedSubscription = await newSubscription.save()
        res.json({ savedSubscription })
    } catch (error) {
        res.json({ message: error.message })
    }

}

//Getting single subscription
const getSingleSubscription = async (req, res) => {

    try {
        const subscription = await Subscription.findOne({ email: req.params.email })
        if (!subscription) {
            res.json({ message: 'No subscription found' })
        }
        else {
            res.json({ message: subscription })
        }
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Getting All subcriptions
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({});
        res.status(200).json({ subscriptions })


    } catch (error) {
        res.json({ message: error.message })
    }

}

//Deleting Subscription
const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndDelete({ email: req.params.email });
        if (!subscription) {
            res.json({ message: 'No subscription found' })
            }
            else {
                res.json({ message: "Subscription deleted successfully", subscription: subscription });
                }


    } catch (error) {
        res.json({ message: error.message })
    }
}

    module.exports = { addSubscription, getSingleSubscription, getAllSubscriptions, deleteSubscription }
