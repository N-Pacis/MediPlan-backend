const express = require('express');
const router = express.Router();

const {logInPatient} = require('../controllers/patientLogInController');

/**
 * @swagger
 * /logIn:
 *   post:
 *     description: LogIn a patient
 *     parameters:
 *       - name: Email
 *         description: First Name of the patient
 *         in: formData
 *         type: string
 *         required: true
 *       - name: Password
 *         description: Last Name of the patient
 *         type: string
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description:Bad Request
 *       404:
 *         description:Not Found
 *       500:
 *         description: Internal Server Error
 */

router.post('/logIn' , logInPatient);
module.exports = router;

