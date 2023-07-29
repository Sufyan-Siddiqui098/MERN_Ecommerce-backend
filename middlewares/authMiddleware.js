const JWT = require("jsonwebtoken")


//Authentication token check. 
const requireSignIn = async(req, res, next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        next()
    } catch(err){
        res.status(400).send(err)
    }
}

module.exports = requireSignIn;