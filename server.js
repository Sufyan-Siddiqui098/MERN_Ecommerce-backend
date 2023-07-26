const express = require('express');
const app = express();
const dotenv = require("dotenv")
const connectDB = require("./db")

//Environment Variable Configured.
dotenv.config();

app.use(express.json())

const PORT = process.env.PORT

app.get("/", (req, res)=>{
    res.send("Welcome to get request..")
})

app.listen(PORT, ()=>{
    connectDB() 
    console.log(`Server is running on ${PORT}`)
})