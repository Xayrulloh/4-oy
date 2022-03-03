const express = require('./lib')
const app = express(), fs = require('fs'), path = require('path')
let users = JSON.parse(fs.readFileSync('./database/users.json')), foods = JSON.parse(fs.readFileSync('./database/foods.json')), orders = JSON.parse(fs.readFileSync('./database/orders.json'))

app.static('./view')

app.get('/', (req, res) => res.render('./index'))
app.get('/users', (req, res) => res.json(users))
app.get('/foods', (req, res) => res.json(foods))
app.get('/orders', (req, res) => {
        const arr = []
    for (let order of orders) {
        let obj = {}
        obj.orderId = order.orderId
        obj.userId = order.userId
        obj.username = users.find(el => el.clientId == order.userId)?.name
        obj.foodId = foods.find(el => el.foodId == order.foodId)?.foodName
        obj.count = order.count
        arr.push(obj)
    }
    res.json(arr)
})

app.post('/users', async(req, res) => {
    let {username, contact} = await req.body
    if (username && username.length <= 30 && !username.trim().includes(' ') && /^[A-Za-z\s]*$/.test(username) && contact.toString().match('^998[389][012345789][0-9]{7}$')) {
        users.push({"clientId":users.at(-1).clientId + 1, "name":username, "phone":contact})
        fs.writeFileSync(path.join(__dirname, 'database', 'users.json'), JSON.stringify(users))
        res.json({
            status: 200,
            message: 'yeah'
        })
    } else {
        res.json({
            status: 400,
            message: 'error'
        })
    }
})

app.post('/orders', async(req, res) => {
    let {userId, foodId, count} = await req.body
    let simple = users.find(el => el.clientId == userId), simple2 = foods.find(el => el.foodId == foodId)
    
    if (count <= 10 && simple && count && simple2) {
        let check = true
        for (let order of orders) {
            if (order.userId == userId && order.foodId == foodId) {
                order.count += +count
                check = false
            }
        }
        if (check) {
            orders.push({"orderId":orders.at(-1).orderId + 1, userId, foodId, count})
        }
        fs.writeFileSync(path.join(__dirname, 'database', 'orders.json'), JSON.stringify(orders))
        res.json({
            status: 200,
            message: 'yeah'
        })
    }
    else {
        res.json({
            status: 400,
            message: 'error'
        })
    }
})

app.put('/users', async(req, res) => {
    let {userId, username, contact} = await req.body
    let check = true

    for (let user of users) {
        if (user.clientId == userId) {
            if (username && username.length <= 30 && !username.trim().includes(' ') && /^[A-Za-z\s]*$/.test(username) && contact.toString().match('^998[389][012345789][0-9]{7}$')) {
                user.name = username
                user.phone = contact
                fs.writeFileSync(path.join(__dirname, 'database', 'users.json'), JSON.stringify(users))
                res.json({
                    status: 200,
                    message: 'yeah'
                })
            } else check = false
        } else check = false
    }
    if (!check) {
        res.json({
            status: 400,
            message: 'error'
        })
    }
})

app.put('/orders', async(req, res) => {
    let {orderId, foodId, count} = await req.body
    let simple = orders.find(el => el.orderId == orderId), simple2 = foods.find(el => el.foodId == foodId)

    if (count <= 10 && simple && count && simple2) {
        for (let order of orders) {
            if (order.orderId == orderId) {
                order.count = count
                order.foodId = foodId
            }
        }
        fs.writeFileSync(path.join(__dirname, 'database', 'orders.json'), JSON.stringify(orders))
        res.json({
            status: 200,
            message: 'yeah'
        })
    }
    else {
        res.json({
            status: 400,
            message: 'error'
        })
    }
})

app.delete('/users', async(req, res) => {
    let {userId} = await req.body
    let simple = users.find(el => el.clientId == userId)
    if (simple) {
        users = users.filter(el => el != simple)
        fs.writeFileSync(path.join(__dirname, 'database', 'users.json'), JSON.stringify(users))
        res.json({
            status: 200,
            message: 'deleted'
        })
    } else {
        res.json({
            status: 400,
            message: 'this user is not exist'
        })
    }
})

app.delete('/orders', async(req, res) => {
    let {orderId} = await req.body
    let simple = orders.find(el => el.orderId == orderId)
    if (simple) {
        orders = orders.filter(el => el != simple)
        fs.writeFileSync(path.join(__dirname, 'database', 'orders.json'), JSON.stringify(orders))
        res.json({
            status: 200,
            message: 'deleted'
        })
    } else {
        res.json({
            status: 400,
            message: 'this order is not exist'
        })
    }
})

app.listen(5000, () => console.log('5000'))



