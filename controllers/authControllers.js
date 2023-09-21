const userModel = require("../models/userModel")
const {createHashPassword, comparePassword} = require("../helpers/authHelper")
const JWT = require("jsonwebtoken")


const registerController = async (req, res)=> {
    try{
        const {name, email, password, phone, address, answer} = req.body;

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
        if(!address || !answer){
            return res.send({message: "Address and answer is required"})
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
            answer
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
                message: "Invalid Credentials"
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

//Forget Password - POST
const forgetPasswordController = async(req, res) => {
    try {
        const {email, answer, password} = req.body;
        //check email, answer , new password presenece.
        if(!email || !answer || !password){
            return res.status(400).send({
                success: false,
                message: "Email, answer and new Password is required"
            })
        }

        //user from user model
        const user = await userModel.findOne({email, answer});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Incorrect email or answer"
            })
        }

        const hashed = await createHashPassword(password);
        await userModel.findByIdAndUpdate(user._id,{password: hashed});

        return res.status(200).send({
            success: true,
            message: "Password reset successfully !"
        })
        

    } catch (error){
        console.log("error in forgetpassword controllers",error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}


//Test Controller
const testController = (req, res) => {
    res.send("Protected Routes")
}

module.exports = {registerController, loginController, testController, forgetPasswordController}