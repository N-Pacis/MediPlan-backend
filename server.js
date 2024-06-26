const express = require("express")
const app = express()
const config = require("config")
const mongoose = require("mongoose")
const debug = require('debug')
const startupdebug = require("debug")("app:startup")
const dbDebug = require('debug')('app:db');
const dbErrors = debug('db:errors')
const error = debug('error')
const bodyParser = require('body-parser')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "MediPlan API",
            description: "MediPlan Backend API",
            servers: ["http://localhost:5000"],
            version: "V1.2.3"
        }
    },
    apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//calling the routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./routes/patientRegistrationRoute'))
app.use(require('./routes/patientLogInRoute'));

// //checking if the port environment variable is sett
if (!config.get("PORT")) {
    error("FATAL ERROR:Port connection is not defined");
    process.exit(-1)
}

//connect to mongo database
mongoose.connect("mongodb+srv://appo-backend:appo12345@appo.pvehh.mongodb.net/appo-backend?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        dbDebug("Connected Successfully...")
    })
    .catch(err => {
        dbErrors("Failed to connect due to ", err)
    })
    // 
//connecting to application port
const port = process.env.PORT || config.get("PORT")
app.listen(port, () => {
    startupdebug(`Listening on port ${port}`)
})
