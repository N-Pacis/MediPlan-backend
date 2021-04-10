const express = require('express')
const router = express.Router()
const {addNewFavorite} = require("../controllers/favoritesController")
const {authenticate} = require("../middlewares/auth.js")

//we call the post method to add a new favorite
router.post('/favorite/:fav',authenticate,addNewFavorite)