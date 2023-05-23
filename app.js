const express = require("express")
const app = express()
const path = require("path")
const cors = require('cors')
const connection = require('./config/database')
const session = require('express-session')
require('dotenv').config()
const uri = process.env.MONGO_URI
const port = process.env.PORT
app.use(express.json())
// app.use(cors())
const corsConfig = {
    credentials :true,
    origin:true
}
app.use(cors(corsConfig))

const routes = require('./routes/userRoutes')
const admin = require('./routes/adminRoutes')
const dataRoute = require('./routes/dataRoutes')
app.use(express.static('public'))
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')))


const sessionKey = process.env.SESSION_SECRET
const fileUpload = require('express-fileupload')

app.use(
    session({
        secret: sessionKey,
        resave: false,
        saveUninitialized: false,
    })
)

app.use('/api/', dataRoute)
app.use('/api/v1', routes)
app.use('/admin', admin)


app.use(fileUpload({
    useTempFiles: true
}));



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