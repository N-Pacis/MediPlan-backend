const mongoose = require('mongoose');
const Joi = require('joi')

function validateFavorite(favorite){
    const schema = {
        favoriteName : Joi.string().min(3).max(300).required(),
        favoriteDescription : Joi.string().max(500).required(),
        favoriteCategory : Joi.string().max(100).valid('doctor','hospital').required(),
        user: Joi.objectId().required()
    }
    return Joi.validate(favorite,schema)
}

const favoritesSchema = new mongoose.Schema({
    favoriteName:{
        type:String,
        minLength:3,
        maxLength:300,
        required:true
    },
    favoriteDescription:{
        type:String,
        maxLength:500,
        required:true
    },
    favoriteCategory:{
        type:String,
        maxLength:100,
        enum:['doctor','hospital'],
        required:true
    },
    User:{
        type:String,
        required:true
    }
})

const Favorite = mongoose.model('favorites',favoritesSchema)

exports.validate = validateFavorite
exports.Favorite = Favorite