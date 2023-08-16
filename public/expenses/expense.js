


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


function removeUserFromScreen(expenseId) {
    console.log('expenseID >>>>', expenseId);
    const expenseElemId = `expense-${expenseId}`;
    document.getElementById(expenseElemId).remove();
  }


  document.getElementById('premium_button').onclick = async function(e) {
    try{
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/purchase/premium-membership',{headers: {"Authorization" : token}})
        console.log(response);
        
        var options =
        {
            "key": response.data.key_id,  //Enter key ID generated from the dashboard
            "order_id": response.data.order.id, //for one time payment
            //this handler function will handle the success payment
            
            "handler": async function(response){
            await axios.post('http://localhost:3000/purchase/update-transactionstatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            },
            {headers: {"Authorization" : token}}),

            alert('you are a premium user now')
            },
        }
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function(response){
            console.log(response)
            alert('something went wrong')
        })

    }
    catch(err){
        console.log(err);
    }
  }