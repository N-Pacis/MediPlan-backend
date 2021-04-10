const express = require('express')
const router = express.Router()
const {addNewFavorite,getFavorites,getOneFavorite} = require("../controllers/favoritesController")
const {authenticate} = require("../middlewares/auth.js")

//we call the post method to add a new favorite
router.post('/favorites/new/:fav',authenticate,addNewFavorite)

//we call the get method to get all favorites
router.get('/favorites',authenticate,getFavorites)

//we call the get method to get specific favorite
router.get('/favorite/:id',authenticate,getOneFavorite)