const User = require('../models/userModel');

const Expense = require('../models/expenseModel');

const sequelize = require('../util/database');

const getUserLeaderBoard = async (req,res,next) => {
    try{
        const leaderboardOfUsers = await User.findAll({
              
            order:[['totalExpenses','DESC']]
        })
        res.status(200).json(leaderboardOfUsers)
    }
    
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports ={
    getUserLeaderBoard
}