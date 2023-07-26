const mongoose = require("mongoose");


const connectDB = async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to MongoDb`)
    } catch (err) {
        console.log(`Error in Mongodb ${err}`)
    }
}

module.exports=  connectDB;