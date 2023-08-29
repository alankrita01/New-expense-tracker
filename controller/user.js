const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

function isstringinvalid(string){
    if(string == undefined || string.length ===0){
        return true
    }else{
        return false
    }
}


const signup = async (req,res,next) => {
    try{
        const {name, email, password} = req.body;
        console.log('email',email);

        //any of the 3 are empty, this will check from backend 
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:"Bad Parameter. Something is missing"})
        }

        const saltRound =10; // higher the saltRound, less possibilty that passwords are same
        bcrypt.hash(password, saltRound, async (err, hash) => {
            console.log(err)
                    
            await User.create({
                name: name,
                email: email,
                password: hash
            })
            res.status(201).json({message: 'Sign Up Sccessful'});
        })
    
    }
    catch(err){
        console.log('error occurred during Signup',err.stack);
        res.status(500).json(err);
    }
}


const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId : id, name: name, ispremiumuser } ,'secretKey');
}


const login = async (req,res,next) => {
    try{
        const {email, password} = req.body;
        console.log('email:', email, ', password', password);

        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({message: 'emailId or password is invalid',success: false});
        }

        //find emailId in user table
        const user = await User.findAll({ where : {email}})
        //if get the user, we will compare password
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err,result) => {
                if(err){
                    res.status(500).json({success: false, message: 'Something went wrong'})
                }
                if(result === true){//user login successfully
                    return res.status(200).json({success: true, message: "User logged in Successfully", token: generateAccessToken(user[0].id, user[0].name)})
                }else{//if password is incorrect
                    return res.status(400).json({success: false, message: 'Password is incorrect'})
                } 
            })
        }
        else{//if password is incorrect
            return res.status(400).json({success: false, message: 'User does not Exist'})
        }
    }
    catch(err){
        console.log('error occurred during login',err.stack);
        res.status(500).json(err);
    }
}

module.exports = {
    signup,
    login,
    generateAccessToken
}