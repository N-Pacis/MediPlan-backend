const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config')
const jwt = require('jsonwebtoken')

function validatePatientRegistration(patient) {
    const schema = {
        firstname: Joi.string().min(3).max(50).required(),
        lastname: Joi.string().min(3).max(50).required(),
        Username: Joi.string().min(4).max(50).required(),
        Email: Joi.string().min(5).max(200).required(),
        DateOfBirth: Joi.date().required(),
        Password: Joi.string().min(5).max(200).required(),
        Gender: Joi.string().required(),
        ContactNumber: Joi.number().required()
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
        unique: true,
        required: true
    },
    DateOfBirth: {
        type: Date,
        required: true,
        trim: true
    },
    Gender: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['male', 'female']
    },
    ContactNumber: {
        type: Number,
        minLength: 10,
        maxLength: 13,
        required: true
    },
    isValidated: {
        type: Boolean,
        default: false,
        required: true
    }
})
patientRegistrationSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, firstname: this.firstname, lastname: this.lastname, Username: this.Username, Password: this.Password, Email: this.Email, Gender: this.Gender, DateOfBirth: this.DateOfBirth, ContactNumber: this.ContactNumber, isValidated: this.isValidated }, config.get('jwtPrivateKey'))
    return token
}
const Patient = mongoose.model('patientInformation', patientRegistrationSchema)

exports.Patient = Patient
exports.validate = validatePatientRegistration