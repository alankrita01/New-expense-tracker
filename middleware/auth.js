const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {

    try{
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, 'secretKey');
        console.log('userId >>>', user.userId);

        try{
            const userN = await User.findByPk(user.userId);

            req.user = userN;
            next();
        }
        catch(err){
            throw new Error(err);
        }
    }
    catch(err){
        console.log('Token verification error:',err.message);
        return res.status(401).json({success: false, message: 'Invalid token'})
    }
    
}

module.exports ={
    authenticate
}