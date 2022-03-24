submit.onclick = async() => {
    if (!username.value || !file.files.length) return alert('Invalid input')
    if (file.files[0].type != "image/jpeg") return alert('Please enter image')
    
    let formData = new FormData()
	formData.append('username', username.value)
	formData.append('file', file.files[0])

    try {
        let response = await fetch('/data', {
            method: 'POST',
            body: formData
        }) 

        response = await response.json()
        window.localStorage.setItem('user', JSON.stringify(response))

        

    } catch (error) {
        alert(error.message)        
    }
	
    window.location = 'http://192.168.42.212:5000/main'
}



