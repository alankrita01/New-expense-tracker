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

function showPremiumuserMessage(){
    document.getElementById('premium_button').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user"
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


//get expense
window.addEventListener("DOMContentLoaded",async (e) => {
    try{
        const token = localStorage.getItem('token')
        

        const decodeToken = parseJwt(token);
        console.log(decodeToken);
        const ispremiumuser = decodeToken.ispremiumuser
        if(ispremiumuser){
            showPremiumuserMessage()
            showLeaderboard()
        }

        const response = await axios.get("http:localhost:3000/expense/get-expense", {headers: {"Authorization" : token}})
        //console.log(response)
        response.data.expenses.forEach(expense => {
            showOnScreen(expense);
        })
    }
    catch(err){
        console.log(err);
        console.log('error occured in frontend get-expense')
    }
})


//show expense details on screen
function showOnScreen(expense) {
    
    const parentNode = document.getElementById("listOfExpenses");
    const expenseId = `expense-${expense.id}`;

    const childHTML = `<li id=${expenseId}> ${expense.amount} - ${expense.description} - ${expense.category} 
    <button style="margin: 7px; padding-left: 7px; padding-right: 5px;  color:red; font-weight: bold;" onclick=deleteExpense('${expense.id}')>Delete Expense</button><br> </li>`;

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


function showError(err){
    document.body.innerHTML += `<div style="color:red;">${err}<\div>`
}


function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'

    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get(`http://localhost:3000/premium/showLeaderBoard`,{headers: {"Authorization" : token}})
        console.log(userLeaderBoardArray);

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += `<h1> Leader Board </h1>`
        userLeaderBoardArray.data.forEach((userDeatils) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDeatils.name} Total Expense - ${userDeatils.total_cost || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);
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
                const res = await axios.post('http://localhost:3000/purchase/update-transactionstatus',{
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                },{headers: {"Authorization" : token}})

                console.log(res);
                alert('you are a premium user now')
                document.getElementById('premium_button').style.visibility = "hidden"
                document.getElementById('message').innerHTML = "You are a premium user"
                localStorage.setItem('token', res.data.token)
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