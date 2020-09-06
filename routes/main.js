const router = require("express").Router()
const verifyToken =require("../validations/webtoken")


router.get("/dashboard", verifyToken, (req, res)=>{
    console.log(req,user)
    res.json({
        user:{
            fullName :req.user.fullName,
            balance: "5000.00"
        },
        loans: []  
    })
})

module.exports = router