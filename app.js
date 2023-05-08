const express = require("express")
const app = express()

const cors = require('cors')
const connection = require('./config/database')
const session = require('express-session')
require('dotenv').config()
const uri = process.env.MONGO_URI
const port = process.env.PORT
app.use(express.json())
app.use(cors())

const routes = require('./routes/userRoutes')
const admin = require('./routes/adminRoutes')
const data = require('./routes/dataRoutes')

const sessionKey = process.env.SESSION_SECRET
const fileUpload = require('express-fileupload')
app.use(fileUpload({
    useTempFiles: true
}));

app.use(
    session({
        secret: sessionKey,
        resave: false,
        saveUninitialized: false,
    })
)

app.use('/api/v1', routes)
app.use('/admin', admin)
app.use('/dataForDatabase', data)

const databaseConnection = () => {
    try {
        connection(uri)
        app.listen(port, ()=>{
            console.log(`App is listening at port ${port}`)
        })

    } catch (error) {
        console.error({ error: error.message })
    }
}
databaseConnection();