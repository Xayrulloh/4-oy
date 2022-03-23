const express = require('./lib')
const app = express(), fs = require('fs'), path = require('path')
let [users, chats] = [JSON.parse(fs.readFileSync('./database/users.json')), JSON.parse(fs.readFileSync('./database/chats.json'))]

app.static('./view')

app.get('/', (req, res) => res.render('./register'))

app.get('/telegram', (req, res) => res.render('./main'))

app.get('/users', (req, res) => res.json(users))

app.get('/chats', (req, res) => res.json(chats))

app.post('/users', async(req, res) => {
    let imagesOfMen = ['https://bootdey.com/img/Content/avatar/avatar1.png','https://bootdey.com/img/Content/avatar/avatar2.png', 'https://bootdey.com/img/Content/avatar/avatar4.png', 'https://bootdey.com/img/Content/avatar/avatar5.png', 'https://bootdey.com/img/Content/avatar/avatar6.png', 'https://bootdey.com/img/Content/avatar/avatar7.png']
    let imagesOfWomen = ['https://bootdey.com/img/Content/avatar/avatar3.png', 'https://bootdey.com/img/Content/avatar/avatar8.png']
    
    let {username, password, confirm, age, gender} = await req.body
    let sameName = users.filter(el => el.username == username)

    if (sameName.length || !isNaN(+username) || !(username && password && confirm && age && gender) || !(gender == 'male' || gender == 'female') || password != confirm || !(password.toString().length >= 4 && confirm.toString().length >= 4)) {
        res.json({
            status: 400,
            message: 'Invalid input'
        })
    } else {
        users.push({username, password, age, gender, "userId":users.at(-1).userId + 1, "time": new Date().toTimeString().slice(0, 9), "image": gender == 'male' ? imagesOfMen[Math.random() * imagesOfMen.length | 0] : imagesOfWomen[Math.random() * imagesOfWomen.length | 0]})
        fs.writeFileSync(path.join(__dirname, 'database', 'users.json'), JSON.stringify(users, null, 4))
        res.json({
            status: 200,
            userId: users.at(-1).userId 
        })
    }
})

app.post('/time', async(req, res) => {
    let {userId} = await req.body
    let check = users.filter(el => el.userId == userId)

    if (check.length) {
        users.map(el => el.userId == userId ? el.time = new Date().toTimeString().slice(0, 9) : '')

        fs.writeFileSync(path.join(__dirname, 'database', 'users.json'), JSON.stringify(users, null, 4))
        res.json({
            status: 200,
            message: 'Ok'
        })
    } else {
        res.json({
            status: 400,
            message: 'Invalid input'
        })
    }
})

app.post('/message', async(req, res) => {
    let {userId, friendId, message} = await req.body
    let check = false

    for (let chat of chats) {
        if (chat.who.split('-')[0] == userId && chat.who.split('-')[1] == friendId || chat.who.split('-')[1] == userId && chat.who.split('-')[0] == friendId) {
            chat.allChats.push({"id":userId, message, "time": new Date().toTimeString().slice(0, 9)})
            check = true 
        }
    }

    if (check) {
        fs.writeFileSync(path.join(__dirname, 'database', 'chats.json'), JSON.stringify(chats, null, 4))
    } else {
        chats.push({"who": `${userId}-${friendId}`,"allChats": [{"id": userId,message,"time": new Date().toTimeString().slice(0, 9)}]})
        fs.writeFileSync(path.join(__dirname, 'database', 'chats.json'), JSON.stringify(chats, null, 4))
    }
    res.json({
        status: 200,
        message: 'Ok'
    })
})

app.delete('/users', async(req, res) => {
    let {userId} = await req.body
    let user, usersCopy = []

    for (let el of users) {
        if (el.userId == userId) {
            user = el
        } else if (el.userId != userId) {
            usersCopy.push(el)
        }
    }

    if (user) {
        chats = chats.filter(chat => chat.who.split('-')[0] != user.userId && chat.who.split('-')[1] != user.userId)

        fs.writeFileSync(path.join(__dirname, 'database', 'users.json'), JSON.stringify(usersCopy, null, 4))
        fs.writeFileSync(path.join(__dirname, 'database', 'chats.json'), JSON.stringify(chats, null, 4))
        res.json({
            status: 200,
            message: 'deleted'
        })
    } else {
        res.json({
            status: 400,
            message: 'Deeng'
        })
    }
})

app.delete('/chat', async(req, res) => {
    let {userId, friendId} = await req.body
    let chatsCopy = []

    for (let chat of chats) {
        let check = true
        if (chat.who.split('-')[0] == userId && chat.who.split('-')[1] == friendId || chat.who.split('-')[0] == friendId && chat.who.split('-')[1] == userId) {
            check = false
        }
        if (check) chatsCopy.push(chat)
    }
   
    if (chatsCopy.length == chats.length) {
        res.json({
            status: 400,
            message: 'deeng'
        })
    } else {
        fs.writeFileSync(path.join(__dirname, 'database', 'chats.json'), JSON.stringify(chatsCopy, null, 4))
        res.json({
            status: 200,
            message: chatsCopy
        })
    }
})

app.listen(5000, () => console.log('5000'))



