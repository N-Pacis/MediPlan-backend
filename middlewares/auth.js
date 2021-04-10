//THIS IS A MIDDLEWARE TO CHECK IF A USER IS AUTHENTICATED
const jwt = require("jsonwebtoken")
const config = require('config')

exports.authenticate = (req,res,next)=>{
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send("Access denied. You need to login first")
    try{
        const user = jwt.verify(token,config.get("jwtPrivateKey"))
        req.user = user
        next()
    }
    catch(ex){
        res.status(400).send('Invalid Token')
    }
}