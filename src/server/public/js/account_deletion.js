async function deleteAccount(v){
    const pass = document.getElementById('d_pass').value;
    const cpass = document.getElementById('d_confirm_pass').value;

    if(pass.length < 6) {
        document.getElementById('delete_error').style.display = 'block';
        document.getElementById('delete_error').innerHTML = 'Passwords must be longer than 6 characters!';
        return;
    }
    if(pass !== cpass){
        document.getElementById('delete_error').style.display = 'block';
        document.getElementById('delete_error').innerHTML = 'Passwords do not match!';
        return;
    }
    const deleted = await fetch('/api/user/delete_acc', {method: "GET", headers: {verification_code: v}});
    const j = await deleted.json();
    if(j.error){
        document.getElementById('delete_error').style.display = 'block';
        document.getElementById('delete_error').innerHTML = j.error;
    } else {
        location.replace('/');
    }
}