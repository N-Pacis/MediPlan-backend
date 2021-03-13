const express = require("express")
const app = express()
const config = require("config")
const mongoose = require("mongoose")
const debug = require('debug')
const startupdebug = require("debug")("app:startup")
const dbDebug = require('debug')('app:db');
const dbErrors = debug('db:errors')
const error = debug('error')

//calling the routes
app.use(express.json())
app.use(require('./routes/patientRegistrationRoute'))

//checking if the Database string environment variable is set
if (!config.get("DatabaseString")) {
    error("FATAL ERROR:Database Connection is not defined");
    process.exit(-1)
}
//checking if the port environment variable is sett
if (!config.get("PORT")) {
    error("FATAL ERROR:Port connection is not defined");
    process.exit(-1)
}

//connect to mongo database
mongoose.connect(config.get("DatabaseString"), { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        dbDebug("Connected Successfully...")
    })
    .catch(err => {
        dbErrors("Failed to connect due to ", err)
    })

//connecting to application port
const port = process.env.PORT || config.get("PORT")
app.listen(port, () => {
    startupdebug(`Listening on port ${port}`)
})