const Blog = require('../models/Blog')
let totalReads = 0;

const blogReadByUsers = (req, res) => {

    totalReads++;
    res.sendStatus(200).send( totalReads );
};


module.exports = { blogReadByUsers };