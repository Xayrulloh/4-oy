let users, li;

getUsers()

submitUsers.onclick = async(even) => {
    even.preventDefault()
    try {
        const test = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": usernameInput.value,
            "contact":telephoneInput.value
        })
    })
    const data = await test.json()
    if (data.status >= 400 && data.status <= 499) {throw new Error('Deeng')}
    } catch (error) {
        [usernameInput.value, telephoneInput.value] = [null, null]
        alert(error)
    }
    
    list.innerHTML = null
    getUsers()
    usernameInput.value = null
    telephoneInput.value = null
}

async function showFoods(l) {
    show.textContent = 'client id:'
    userHeader.textContent = 'customer:  ' + l.children[0].textContent
    clientId.textContent =  l.children[0].getAttribute('id')
    orders = await (await fetch('http://localhost:5000/orders')).json()
    orders = orders.filter(el => el.userId == +clientId.textContent)

    if (orders.length) {
        ordersList.innerHTML = null
        for (let ordeR of orders) {
            ordersList.innerHTML += `<li class="order-item"><img src="./img/${ordeR['foodId']}.jpeg"><div><span class="order-name">${ordeR['foodId']}</span><span class="order-count">${ordeR.count}</span></div></li>`
        }
    }
}


submitFoods.onclick = async(even) => {
    even.preventDefault()
    let [food, count] = [foodsSelect.value, foodsCount.value]
    if (clientId.textContent) {
        try {
            const test = await fetch('http://localhost:5000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": +clientId.textContent, 
                "foodId": +food, 
                "count": +count
            })
        })
        const data = await test.json()
        if (data.status >= 400 && data.status <= 499) {throw new Error('Deeng')}
        } catch (error) {
            [foodsSelect.value, foodsCount.value] = [1, null]
            alert(error)
        }
        
        orders = await (await fetch('http://localhost:5000/orders')).json()
        orders = orders.filter(el => el.userId == +clientId.textContent)

        if (orders.length) {
            ordersList.innerHTML = null
            for (let ordeR of orders) {
                ordersList.innerHTML += `<li class="order-item"><img src="./img/${ordeR['foodId']}.jpeg"><div><span class="order-name">${ordeR['foodId']}</span><span class="order-count">${ordeR.count}</span></div></li>`
        }
    }
        foodsSelect.value = 1
        foodsCount.value = null
    } else alert('Deeng')
}



async function getUsers() {
    users = await fetch('http://localhost:5000/users')
    users = await users.json()
    for(let csr of users) {
        list.innerHTML += `<li class="customer-item"><span id="${csr['clientId']}" class="customer-name">${csr['name']}</span><a class="customer-phone" href="tel:+${csr['phone']}">+${csr['phone']}</a></li>`
    }
    li = document.querySelectorAll('.customer-item')
    for (let l of li) {
        l.onclick = () => {showFoods(l)}
    }
    return users
}



