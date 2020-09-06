const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = function(req, res, next){
    const token = req.header("auth-token")
    if(!token) return res.status(401).send("Unauthorized resource")
    
    try {
        const verified = jwt.verify(token, process.env.JSON_WEB_TOKEN_KEY)
        req.user = verified
        next()
        
    } catch (error) {
       res.status(400).send('Invalid Authorization details') 
    }

}