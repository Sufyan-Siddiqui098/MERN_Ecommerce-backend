const userModel = require("../models/userModel")
const {createHashPassword, comparePassword} = require("../helpers/authHelper")
const JWT = require("jsonwebtoken")


const registerController = async (req, res)=> {
    try{
        const {name, email, password, phone, address} = req.body;

        //validation
        if(!name){
            return res.send({message: "Name is required"})
        }
        if(!email){
            return res.send({message: "Email is required"})
        }
        if(!password){
            return res.send({message: "Password is required"})
        }
        if(!phone){
            return res.send({message: "Phone is required"})
        }
        if(!address){
            return res.send({message: "Address is required"})
        }

        //Check user
        const existingUser = await  userModel.findOne({email})
        //existing user
        if(existingUser){
            return res.status(403).send({
                success: false,
                message: "Already Registered please login"
            })
        }

        //register new User.
        const hashedPassword = await createHashPassword(password);
        const user = await userModel.create({
            name,
            phone,
            email,
            password: hashedPassword,
            address,
        })

        res.status(200).send({
            success: true,
            message: "User registered successfully !",
            user: {name, phone, email, address}
        })


    } catch(error) {
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error: error
        })
    }       
}


//POST - Login
const loginController = async(req, res) => {
    try{
        const {email, password} = req.body;
        
        //validation
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            })
        }

        const user = await userModel.findOne({email})
        //If user not found with the email provided
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }

        const matchPass = await comparePassword(password, user.password);

        //if password doesn't matcht the existing password
        if(!matchPass){
            return res.status(400).send({
                success: false,
                message: "Invalid Password"
            })
        }

        //Token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token
        })


    } catch(err){
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error: err
        })
    }
}

//Test Controller
const testController = (req, res) => {
    res.send("Protected Routes")
}

module.exports = {registerController, loginController, testController}