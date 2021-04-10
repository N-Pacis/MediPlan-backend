const {Favorite,validate} = require("../models/favoritesModel")

//function to add a new favorite. We will get a url that is like this  "/favorites/favoriteCategory:favoriteCategoryId then we split it

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