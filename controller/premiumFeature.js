const User = require('../models/userModel');

const Expense = require('../models/expenseModel');

const sequelize = require('../util/database');

const getUserLeaderBoard = async (req,res,next) => {
    /*try{
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
    }*/
    try{
        const users = User.findAll();
        const expenses = Expense.findAll();
        const userAggregatedExpense = {}
        console.log(expenses)

        expenses.forEach((expense) => {

            if(userAggregatedExpense[expense.userId]){
                userAggregatedExpense[expense.userId] = userAggregatedExpense[expense.userId]+expense.amount;
            }
            else{
                userAggregatedExpense[expense.userId]= expense.amount;
            }
        })

        var userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpense[user.id]})
        })
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports ={
    getUserLeaderBoard
}