const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    slug : {
        type : String,
        require: true,
        lowercase: true
    }
})

module.exports = mongoose.model('categories', categorySchema);