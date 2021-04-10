const { validate, Patient } = require("../models/patientRegistrationModel")
const { sendEmail } = require("../utils/emailConfig")
const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('config')


exports.registerPatient = async(req, res) => {
    try {
        //validate the req.body using the imported validate function
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        //search if the patient with either username or email exist
        let patient = await Patient.findOne({ $or: [{ Username: req.body.Username }, { Email: req.body.Email }] })
        if (patient) return res.status(400).send(`Patient with username or email is already registered`)
        patient = new Patient(_.pick(req.body, ['firstname', 'lastname', 'Username', 'Password', 'Gender', 'ContactNumber', 'Email', 'DateOfBirth']))

        //generate the encryption salt and hash the password
        const salt = await bcrypt.genSalt(10)
            //@ts-ignore
        patient.Password = await bcrypt.hash(patient.Password, salt)

        //try saving the patient info
        try {
            await patient.save()
                //@ts-ignore

            //generating the authentication token
            const token = patient.generateAuthToken()

            //sending an email to the patient
            const subject = "MediPlan:Verify your email by clicking the link below"
            const html = `<a href='http://localhost:5000/verification/${token}'>Mediplan Verification Link.</a>`;
            //@ts-ignore
            sendEmail(patient.Email, subject, html)

            //sending a response
            res.header('x-auth-token', token).send(_.pick(patient, ['_id', 'firstname', 'lastname', 'Username', 'Email', 'DateOfBirth', 'Gender', 'ContactNumber']))
        }
        //catch error if occured
        catch (ex) {
            res.status(400).send(ex.message)
        }
    } catch (ex) {
        res.status(500).send(ex.message)
    }
}

exports.validatePatientByEmail = async(req, res) => {
    //request the token from the params
    const token = req.params.token;
    if (!token) return res.status(400).send("Invalid URL!")
    try {
        //decode the jwt token using the private key
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"))
            //extract the patientId from the decoded token
            //@ts-ignore
        const patientId = decoded._id
            //find the patient in the database and update him/her
        let patient = await Patient.findByIdAndUpdate(patientId, { isValidated: true }, { new: true })
            //generate a new token for the updated record
            //@ts-ignoreA Z              
        patient.generateAuthToken()
        res.send("Your email is now validated")
    } catch (ex) {
        res.status(400).send(ex.message)
    }
}