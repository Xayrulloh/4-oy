submitLogin.onclick = async() => {
    if (!(usernameLogin.value && passwordLogin.value)) return
    
    try {
        let users = await (await fetch('http://192.168.42.212:5000/users')).json()
        let user = users.filter(user => user.password.toLowerCase() == passwordLogin.value.toLowerCase() && user.username.toLowerCase() == usernameLogin.value.toLowerCase())

        if (user.length) {
            fetch('http://192.168.42.212:5000/time', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userId" : user[0].userId
                })
            })
            .then(el => console.log(el))

            window.localStorage.setItem('user', JSON.stringify({"userId": user[0].userId})) 
            window.location = 'http://192.168.42.212:5000/telegram'
        } else {
            throw new Error('Deeng').message
        }
    }catch (error) {
        alert('This user is not found')
        window.location = 'http://192.168.42.212:5000'
    }
    [usernameLogin.value, passwordLogin.value] = [null, null]
}

submitSignup.onclick = async() => {
    try {
        const test = await fetch('http://192.168.42.212:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": usernameSignup.value, 
            "password": passwordSignup.value, 
            "confirm": confirmSignup.value,
            "age": ageSignup.value,
            "gender": genderSignup.value
        })
    })
    const data = await test.json()
    
    if (data.status >= 400 && data.status <= 499) {throw new Error('Deeng')}
    
    window.localStorage.setItem('user', JSON.stringify({"userId": data.userId})) 
    window.location = 'http://192.168.42.212:5000/telegram'
    
    
    }catch (error) {
        alert('Invalid input')
        window.location = 'http://192.168.42.212:5000'
    }
    usernameSignup.value = null
    passwordSignup.value = null
    confirmSignup.value = null
    ageSignup.value = null
    genderSignup.value = null
}



