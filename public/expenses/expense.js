

//add Expense
async function expense(e){
    try{
        e.preventDefault();

        const amount = e.target.amount.value;
        const description = e.target.description.value;
        const category = e.target.category.value;

        const expenseDetails = {
            amount : amount,
            description : description,
            category : category
        }

        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:3000/expense/add-expense',expenseDetails, {headers: {"Authorization" : token}})
        showOnScreen(response.data.newExpenseDetails);
    }
    catch(err){
        document.body.innerHTML += `<h4> Something went wrong </h4>`;
        console.log(err);
    }
}

//get expense
window.addEventListener("DOMContentLoaded",async (e) => {
    try{
        const token = localStorage.getItem('token')
        const response = await axios.get("http:localhost:3000/expense/get-expense", {headers: {"Authorization" : token}})
        //console.log(response)
        response.data.expenses.forEach(expense => {
            showOnScreen(expense);
        })
    }
    catch(err){
        console.log(err);
    }
})


//show expense details on screen
function showOnScreen(expense) {
    
    const parentNode = document.getElementById("listOfExpenses");
    const expenseId = `expense-${expense.id}`;

    const childHTML = `<li id=${expenseId}> ${expense.amount} - ${expense.description} - ${expense.category} 
    <button style="margin: 5px; padding-left: 7px; padding-right: 7px; color:green; font-weight: bold;" onclick=editExpenseDetails('${expense.description}','${expense.amount}','${expense.category}','${expense.id}')>Edit</button>
    <button style="margin: 7px; padding-left: 7px; padding-right: 5px;  color:red; font-weight: bold;" onclick=deleteExpense('${expense.id}')>Delete</button><br> </li>`;

    parentNode.innerHTML += childHTML;
}


//edit expense
function editExpenseDetails(description,amount, category, expenseId) {
  
    document.getElementById("description").value = description;
    document.getElementById("amount").value = amount;
    document.getElementById("category").value = category;

    deleteExpense(expenseId);
}


//delete expense
async function deleteExpense(expenseId){
    
    try{
      
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {headers: {"Authorization" : token}})
        //console.log(response);
        removeUserFromScreen(expenseId);
    }
    catch(err){
        console.log(err);
    }
}

//remove expense
/*function removeUserFromScreen(expenseId) {
    console.log('r',expenseId)
    const parentNode = document.getElementById("listOfExpenses");
    const childNodeToBeDeleted = document.getElementById(expenseId);
  
    console.log(childNodeToBeDeleted);
    if (childNodeToBeDeleted) {
      parentNode.removeChild(childNodeToBeDeleted);
    }
}*/
function removeUserFromScreen(expenseId) {
    console.log('r', expenseId);
    const expenseElemId = `expense-${expenseId}`;
    document.getElementById(expenseElemId).remove();
    /*const parentNode = document.getElementById("listOfExpenses");
    const childNodeToBeDeleted = document.getElementById(expenseElemId);
  
    console.log('parentNode:', parentNode);
    console.log('childNodeToBeDeleted:', childNodeToBeDeleted);
  
    if (childNodeToBeDeleted) {
      parentNode.removeChild(childNodeToBeDeleted);
    } else {
      console.log('Element with expenseId not found.');
    }*/
  }