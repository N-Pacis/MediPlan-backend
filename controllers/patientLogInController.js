const {validateLogIn, Patient} = require("../models/patientRegistrationModel");
const bcrypt = require('bcrypt');
const _ = require('lodash');

exports.logInPatient = async(req , res ) => {
    try{
        //validate the req.body using the imported validate function from patientRegistrationModel
        const {error} = validateLogIn(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        
        //search if the patient with either email exist
        let patient = Patient.findOne({Email: req.body.Email});
        if(!patient) return res.status(400).send("Invalid email or password!");
        
        // check if req.body.password exists
        const validPassword = bcrypt.compare(req.body.Password, patient.Password);
        if(!validPassword) return res.status(400).send("Invalid email or password!");
        
        res.send(true);
    } 
    // catch error if occured
    catch(error){
        res.status(400).send(error.message);
    }

}