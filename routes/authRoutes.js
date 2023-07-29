const express = require("express")
const {registerController, loginController, testController} = require('../controllers/authControllers');
const requireSignIn = require("../middlewares/authMiddleware");


//Router Object
const router = express.Router();

//Routing

//Register || Method : POST
router.post('/register', registerController)

//Login || Method: POST
router.post('/login', loginController)

//test Route
router.get('/test', requireSignIn, testController)

module.exports = router