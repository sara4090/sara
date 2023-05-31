const Blog = require('../models/Blog')
let totalViews = 0;


const setViews = (req, res) => {
    totalViews++;
    res.json({ message: 'View count updated successfully.' });

}



const getViews = (req, res) => {

    res.json({ totalViews });

};

module.exports = { getViews, setViews };