const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require("dotenv")
const connectDB = require("./db")
const authRoutes = require("./routes/authRoutes")
//Environment Variable Configured.
dotenv.config();
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

//routes
app.use('/api/v1/auth', authRoutes)


app.listen(PORT, ()=>{
    connectDB() 
    console.log(`Server is running on ${PORT}`)
})