const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const ForgotPassword = require('../models/forgotPassModel');

const forgotPass = async (req,res,next) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({where: {email}});

        if(user){
            const id = uuid.v4();
            console.log("id =>>",id);
            user.createForgotPassword({ id, active: true})
                .catch(err=>{
                    throw new Error(err)
                })
            
                sgMail.setApiKey(process.env.SENDGRID_API_KEY)

                const msg = {
                    to: email,
                    from: 'alankritapatidar@gmail.com',
                    subject: 'Sending with SendGrid Is Fun',
                    text: 'and easy to do anywhere, even with Node.js',
                }

                sgMail
                .send(msg)
                .then((response) => {
                    console.log("backend response =>>>", response)
                    return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail',success: true})
                })
                
                .catch((error) => {
                    console.log('error occur in forgot passwaord backend 1')
                    throw new Error(error);
                })
        }
        else{
            throw new Error(error);
        }

    }
    catch(err){
        
        console.log(err,'error occur in forgot passwaord backend 2');
        return res.json({message: err, success: false});
    }
}

module.exports ={
    forgotPass
}