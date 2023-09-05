async function forgotPassword(event){

    try{
        event.preventDefault();
        console.log(event.target.name);
        const form = new FormData(event.target);

        const forgotPass = {
            email: form.get("email"),
        }

        console.log(forgotPass);
        const response = await axios.post('http://localhost:3000/password/forgot-password',forgotPass)
        console.log("response =>>>",response);
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