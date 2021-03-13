const mongoose = require('mongoose');
const Joi = require('joi');

function validatePatientRegistration(patient) {
    const schema = {
        firstname: Joi.string().min(3).max(50).required(),
        lastname: Joi.string().min(3).max(50).required(),
        Username: Joi.string().min(4).max(50).required(),
        Password: Joi.string().min(5).max(200).required(),
        Gender: Joi.string().min(5).max(200).required(),
        ContactNumber: Joi.number().min(10).max(13).required()
    }
    return Joi.validate(patient, schema)
}

const patientRegistrationSchema = new mongoose.Schema({
    firstname: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    lastname: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    Username: {
        type: String,
        minLength: 4,
        maxLength: 50,
        unique: true,
        required: true
    },
    Password: {
        type: String,
        minLength: 5,
        maxLength: 200,
        required: true
    },
    Email: {
        type: String,
        minLength: 5,
        maxLength: 200,
        required: true
    },
    Gender: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['male', 'female']
    },
    ContactNumber: {
        type: String,
        minLength: 10,
        maxLength: 13,
        required: true
    }
})

const Patient = mongoose.model('patientInformation', patientRegistrationSchema)

exports.Patient = Patient
exports.validate = validatePatientRegistration