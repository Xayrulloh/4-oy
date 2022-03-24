let user = JSON.parse(window.localStorage.getItem('user'))

show()

send.onclick = async() => {
    if (!(text.value && file.files[0]) || file.files[0].type == 'audio/x-m4a') return alert('Invalid input')
    
    let formData = new FormData()
    formData.append('userId', user.userId)
    formData.append('text', text.value)
    formData.append('file', file.files[0])
    
    try {
        let response = fetch('/write', {
            method: 'POST',
            body: formData
        }).then(() => show())
        
        response = await response.json()
        
    } catch (error) {
        console.log(error.message);        
    }
    text.value = null
}



async function show() {
    let data = await (await fetch('http://192.168.42.212:5000/data')).json()

    basket.innerHTML = null
    for (let el of data) {
        if (el.img && el.text) {
            basket.innerHTML += `<li>
            <div class="user_img">
            <img class="user_imgm" src=http://192.168.42.212:5000/${el.profileImg} alt="">
            <p>${el.username}</p>
            </div>
            <div class="test">
            <object data="http://192.168.42.212:5000/${el.img}" width="300" height="200"></object>
            <div>
            <div>
            <p>${el.text}</p>
            </div>
            <a href="http://192.168.42.212:5000/${el.img}" download="http://192.168.42.212:5000/${el.img}">
            <button>DOWNLOAD</button>
            </div>
            </div>
            </li>`
        }
    }
}





