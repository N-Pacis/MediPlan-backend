const { validate, Patient } = require("../models/patientRegistrationModel")
const express = require('express')
const router = express.Router()
const _ = require('lodash')

router.post('/register', async(req, res) => {
    try {
        const { error } = await validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        let username = await Patient.findOne({ Username: req.body.Username })
        if (username) return res.status(400).send(`Patient with username ${username} is already registered`)
        let patient = new Patient(_.pick(req.body, ['firstname', 'lastname', 'Username', 'Password', 'Email', 'Gender', 'ContactNumber']))
        const salt = await bcrypt.genSalt(10)
        patient.Password = await bcrypt.hash(patient.Password, salt)
        try {
            patient.save()
            res.send("Patient registered successfully...", patient)
        } catch (ex) {
            res.status(400).send(ex.message)
        }
    } catch (ex) {
        res.status(500).send(ex.message)
    }
})

module.exports = router