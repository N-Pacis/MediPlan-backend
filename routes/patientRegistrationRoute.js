const { validate, Patient } = require("../models/patientRegistrationModel")
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const _ = require('lodash')

/**
 * @swagger
 * /register:
 *   post:
 *     description: Register a new patient
 *     parameters:
 *       - name: firstname
 *         description: First Name of the patient
 *         in: formData
 *         type: string
 *         required: true
 *       - name: lastname
 *         description: Last Name of the patient
 *         type: string
 *         in: formData
 *         required: true
 *       - name: Username
 *         description: User Name of the patient
 *         type: string
 *         in: formData
 *         required: true
 *       - name: Email
 *         description: Email of the patient
 *         type: string
 *         in: formData
 *         required: true
 *       - name: Password
 *         description: Password of the patient
 *         type: string
 *         in: formData
 *         required: true
 *       - name: Gender
 *         description: Gender of the patient
 *         type: string
 *         in: formData
 *         required: true
 *       - name: ContactNumber
 *         description: Contact Number of the patient
 *         in: formData
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', async(req, res) => {
    try {
        //validate the req.body using the imported validate function
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        //search if the patient with either username or email exist
        let patient = await Patient.findOne({ $or: [{ Username: req.body.Username }, { Email: req.body.Email }] })
        if (patient) return res.status(400).send(`Patient with username or email is already registered`)
        patient = new Patient(_.pick(req.body, ['firstname', 'lastname', 'Username', 'Password', 'Gender', 'ContactNumber', 'Email']))

        //generate the encryption salt and hash the password
        const salt = await bcrypt.genSalt(10)
            //@ts-ignore
        patient.Password = await bcrypt.hash(patient.Password, salt)

        //try saving the patient info
        try {
            await patient.save()
                //@ts-ignore
            res.send("Patient registered successfully...")
        }
        //catch error if occured
        catch (ex) {
            res.status(400).send(ex.message)
        }
    } catch (ex) {
        res.status(500).send(ex.message)
    }
})

module.exports = router