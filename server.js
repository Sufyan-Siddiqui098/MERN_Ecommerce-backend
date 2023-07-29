const express = require('express');
const app = express();
const dotenv = require("dotenv")
const connectDB = require("./db")
const authRoutes = require("./routes/authRoutes")
//Environment Variable Configured.
dotenv.config();
const PORT = process.env.PORT

app.use(express.json())

//routes
app.use('/api/v1/auth', authRoutes)


app.get("/", (req, res)=>{
    res.send("Welcome to get request..")
})

app.listen(PORT, ()=>{
    connectDB() 
    console.log(`Server is running on ${PORT}`)
})