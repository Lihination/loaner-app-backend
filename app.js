const express = require('express');
const app = express();
const mongoose = require('mongoose')

require('dotenv').config()

const SERVER_PORT_NO = process.env.PORT || 5500


const startServer = async()=>{
    await mongoose
    .connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true })
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=> console.log(err));

    app.use(express.json())
    //ROUTES
    app.use('/auth', require("./routes/authentication"));
    app.use("/", require("./routes/main"))
    //START SERVER
    app.listen(SERVER_PORT_NO, ()=> console.log(`Server is running on Port: ${SERVER_PORT_NO}`));
}

startServer()