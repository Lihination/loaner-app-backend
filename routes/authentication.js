const router = require("express").Router();
const User = require("../models/User");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt")
const { registerValidationSchema, loginValidationSchema} = require("../validations/validate")
const jwt = require("jsonwebtoken")



router.post("/register", async (req, res) => {
  //VALIDATE USERS' REQUEST
  const { error } = registerValidationSchema.validate(req.body);
  if (error) {
    res.send(error.details[0].message);
  } else {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.send("User email already registered");
    } else {
        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

      const user = new User({
        phoneNumber: req.body.phoneNumber,
        fullName: req.body.fullName,
        email: req.body.email,
        state: req.body.state,
        dob: req.body.dob,
        password: hashedPassword,
      });
      try {
        // Save User to Database
        const savedUser = await user.save();
        res.send(savedUser);
      } catch (err) {
        res.status(500).send(err);
      }
    }
    }
});

router.post("/login", async (req, res)=>{
    //validate user's request
    const {error} = loginValidationSchema.validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
            } else {
                //check if user exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            //check user password

            const validPassword = await bcrypt.compare(req.body.password, existingUser.password)
                if(validPassword){
                    //assign a user
                    const token = jwt.sign({
                        _id: existingUser,
                        fullName: existingUser.fullName
                    }, process.env.JSON_WEB_TOKEN_KEY)
                    res.header("auth-token", token).json({"status": "success", token})
                    // return res.send("Login Successful")
                }else{
                    return res.status(400).send("Email and/or Password is wrong")
                }
            }
    }
})

module.exports = router;
