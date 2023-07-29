const bcrypt = require('bcrypt');

//function for creating Hashed password.
const createHashPassword = async(password)=>{
    try{
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        return hashedPassword;
    } catch(err){
        console.log(err)
    }
}

//Function for comparing password with hashed-passord
const comparePassword = async (password, hashedPassword)=>{
    return bcrypt.compare(password, hashedPassword)
}

module.exports = {createHashPassword, comparePassword}