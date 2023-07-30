const JWT = require("jsonwebtoken")
const userModel = require("../models/userModel")

//Authentication token check. 
const requireSignIn = async(req, res, next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decode; // send the user in req -- it has the {_id, initialzed at , expire at } properties with values.
        next()
    } catch(err){
        res.status(400).send(err)
    }
}

// Admin access

const isAdmin = async (req, res, next)=> {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role !== 1){
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Acess"
            })
        }
        else {
            next()
        }
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "error in amdin middleware",
            error: err
        })
    }
}

module.exports = {requireSignIn, isAdmin};