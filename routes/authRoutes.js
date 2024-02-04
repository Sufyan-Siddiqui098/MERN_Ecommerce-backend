const express = require("express")
const {registerController, loginController, testController, forgetPasswordController, updateUserInfoController} = require('../controllers/authControllers');
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware");


//Router Object
const router = express.Router();

//Routing

//Register || Method : POST
router.post('/register', registerController)

//Login || Method: POST
router.post('/login', loginController)

//test Route
router.get('/test', requireSignIn, isAdmin, testController)

//forget password || POST
router.post('/forget-password', forgetPasswordController)

// Update User Profile - except email
router.put("/update-profile", requireSignIn, updateUserInfoController) 

//Protected Route auth
router.get('/user-auth', requireSignIn, (req, res)=>{
    res.status(200).send({ok: true})
})

//Admin protected route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res)=>{
    return res.status(200).send({ok: true})
})

module.exports = router