async function forgotPassword(event){

    try{
        event.preventDefault();
        const email = document.getElementById('email').ariaValueMax;

        const forgotPass = {
            email: email
        }

        console.log(forgotPass);
        const response = await axios.post('http:localhost:3000/password/forgot-password',forgotPass)
        alert(response.data.message)

        if(response.status === 202){
            document.body.innerHTML = document.body.innerHTML + "<h3 style= 'color:green'>Mail Sent Succesfully!!! </h3>"
        }
        else{
            throw new Error('Something went Wrong!')
        }
    }
    catch(err){
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>`
    }
}