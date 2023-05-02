const mongoose = require('mongoose')
const connection = (uri) => {
    return mongoose.connect(uri)
}
module.exports = connection