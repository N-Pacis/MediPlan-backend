const {Favorite,validate} = require("../models/favoritesModel")

//function to get all favorites
exports.getFavorites = async(req,res)=>{
    try{
        //we get the user from the authentiction middleware
        const userId = req.user._id
        //we get the list of favorites
        const favorites = await Favorite.find({user:userId})
        if(!favorites) return res.status(400).send("You have no favorites yet!");
        res.send(favorites);
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
}
// function to get favorite doctors
exports.getFavoriteDoctors = async(req,res)=>{
    try{
        //we get the user from the authentiction middleware
        const userId = req.user._id
        //we get the list of favorites
        const favorites = await Favorite.find({user:userId, favoriteCategory:'doctor'})
        if(!favorites) return res.status(400).send("You have no favorites yet!");
        res.send(favorites);
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
}

// function to get favorite hospitals
exports.getFavoriteHospitals = async(req,res)=>{
    try{
        //we get the user from the authentiction middleware
        const userId = req.user._id
        //we get the list of favorites
        const favorites = await Favorite.find({user:userId, favoriteCategory:'hospital'})
        if(!favorites) return res.status(400).send("You have no favorites yet!");
        res.send(favorites);
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
}

//function to get one favorite by passing the favorite id in the params
exports.getOneFavorite = async(req,res)=>{
    try{
        const userId = req.user._id
        const favorite = await Favorite.find({_id:req.params.id,user:userId})
        if(!favorite) return res.status(404).send("The requested favorite was not found")
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
}

//function to add a new favorite. We will get a url that is like this  "/favorites/new/favoriteCategory:favoriteCategoryId then we split it
exports.addNewFavorite = async (req, res) => {
    try {
        //we get the user id from the authentication middleware
        const user = req.user._id

        //we get the part that contains favoriteCategory:favoriteCategoryId
        const favoriteIdentifier = req.params.fav
        if (!favoriteIdentifier) return res.status(400).send("Invalid URL!")

        //we split the string into two parts
        const str = favoriteIdentifier.split(":")
        const favoriteCategory = str[0]
        const categoryDetails = str[1]

        //we check whether the favorite category is doctor or hospital so that we can use doctor model or hospital model
        if (favoriteCategory == 'doctor') {
            //@ts-ignore
            //we use imaginary Doctor model which we will create later
            const doctor = await Doctor.findById(categoryDetails)
            if (!doctor) return res.status(400).send("The doctor does not exist")

            //we use the details from the Doctor model to fill in the required fields for the favorites
            let newFavorite = new Favorite({
                favoriteName: doctor.name,
                favoriteDescription: doctor.location,
                favoriteCategory: 'doctor',
                user: user
            })

            //we check whether the new favorite is valid using joi
            let {error} = validate(newFavorite)
            if (error) return res.status(400).send(error.details[0].message)
            try {
                //we save the new favorite
                await newFavorite.save()
                res.send(newFavorite);
            } catch (ex) {
                res.status(400).send(ex.message)
            }

        } 
        
        else if (favoriteCategory == 'hospital') {
            //@ts-ignore
            //we use imaginary Hospital model which we will create later
            const hospital = await Hospital.findById(categoryDetails)
            if (!hospital) return res.status(400).send("The hospital does not exist")

            //we use the details from the hospital model to fill in the required fields for the favorites
            let newFavorite = new Favorite({
                favoriteName: hospital.name,
                favoriteDescription: hospital.location,
                favoriteCategory: 'hospital',
                user: user
            })

            //we check whether the new favorite is valid using joi
            let {error} = validate(newFavorite)
            if (error) return res.status(400).send(error.details[0].message)
            try {
                //we save the new favorite
                await newFavorite.save()
                res.send(newFavorite);
            } catch (ex) {
                res.status(400).send(ex.message)
            }
        }
    } catch (ex) {
        res.status(500).send(ex.message)
    }
}

exports.getNumberOfFav = async(req, res)=>{
    try {
        // getting the user

        const userId = req.user._id;

        // getting number of user's saved favorites
        Favorite.find({user: userId})
        .then(favorites =>{
                return res.status(200).send(favorites.length);
        })
        
    } catch (err) {
        return res.status(400).send(err)
    }

}

// function to delete all favorites

exports.deleteAllFavorites = async(req,res)=>{
    try {
        // getting the user
        const userId = req.user._id;
        // deleting all favorites
        Favorite.remove({user: userId})
        .then( result =>{
            if(result){
                return res.status(200).send("Deleted all");
            }else{
                return res.status(200).send("You have no favorites yet...")
            }
        })
        
    } catch (error) {
        return res.stauts(400).send(error)
    }
}
exports.deleteOneFavorite = async(req, res)=>{
    try {
        // getting the user
        const userId = req.user._id;
        const favId = req.params.id;
        // deleting all favorites
        Favorite.remove({user: userId, _id:id})
        .then( result =>{
            if(result){
                return res.status(200).send("Deleted successfully");
            }else{
                return res.status(200).send("Not found");
            }
        })
        
    } catch (error) {
        return res.status(400).send(error);
    }
}