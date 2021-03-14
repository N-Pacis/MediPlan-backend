const express = require('express')
const router = express.Router()
const { registerPatient } = require('../controllers/patientRegistrationController')

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
 *       400:
 *         description:Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', registerPatient)

module.exports = router