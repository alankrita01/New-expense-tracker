const Expense = require('../models/expenseModel');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    }else{
        return false
    }
}


const addExpense = async(req, res, next) => {
    console.log(req.body);

    try{
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        if(amount == undefined || amount.length === 0){
            return res.status(400).json({success: false, message: 'Parameter missing'})
        }

        if(isstringinvalid(deleteExpense) || isstringinvalid(category)){
            return res.status(400).json({success: false, message: 'Parameter missing'})
        }

        const data = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        })
        res.status(201).json({newExpenseDetails: data, success: true})
    }
    catch(err){
        console.log('error occurred during adding expenses',JSON.stringify(err));
        res.status(500).json({error:err})
    }
}


//get Expense

const getExpense = async (req,res,next) => {
    try{
        const expenses = await Expense.findAll({where: {userId: req.user.id}})
        return res.status(200).json({ expenses, success: true})
    }
    catch(err){
        console.log('error occurred during get expense in backend',JSON.stringify(err));
        res.status(500).json({error: err, success: false});
    }
}


//delete expense
const deleteExpense = async (req,res,next) => {
    try{
        const expenseId = req.params.expenseId;
        if(expenseId == undefined || expenseId.length === 0){
            return res.status(400).json({success:false, message:'Parameters are missing'})
        }
        const noOfRows = await Expense.destroy({where: {id: expenseId, userId: req.user.id}})
            if(noOfRows === 0){
                return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
            }    
            return res.status(200).json({ success: true, message: "Deleted Successfuly"})
    }
    catch(err){
        console.log('error occurred during delete expense',JSON.stringify(err));
        res.status(500).json({error: err});

    }
}


//edit expense
const editExpense = async (req,res,next) => {
    try{
        if(req.params.id == 'undefined'){
            console.log('For Delete, expense id is missing');
            return res.status(400).json({err : 'ID is missing'})
          }
      
          const eId = req.params.id;
          const expense = await Expense.findOne({where : {id: eId}});
      
      
          await expense.save();
          res.sendStatus(200).json({expense});
    }
    catch(err){
        console.log('Edit Expense is Failing', JSON.stringify(err));
         res.status(500).json({
            error:err
        })
    }
}       

module.exports = {
addExpense,
getExpense,
deleteExpense,
editExpense
}