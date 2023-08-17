const User = require('../models/userModel');

const Expense = require('../models/expenseModel');

const sequelize = require('../util/database');

const getUserLeaderBoard = async (req,res,next) => {
    try{
        const leaderboardOfUsers = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost','DESC']]
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