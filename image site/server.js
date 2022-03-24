const express = require('./lib/express.js'), PORT = '5000', data = require('./database/data.json'), path = require('path'), app = new express(), fs = require('fs')

app.set('views', path.join(__dirname, 'view'))
app.set('static', path.join(__dirname, 'view'))

app.get('/', (req, res) => res.render('login'))
app.get('/main', (req, res) => res.render('index'))

app.get('/data', (req, res) => {return res.json(data)})

app.post('/data', async (req, res) => {
	const { username, file } = await req.body
	data.push({
		userId: data[data.length - 1]?.userId ? data[data.length - 1].userId + 1 : 1,
		username: username[0],
		profileImg: path.basename(file),
	})

    fs.writeFileSync(path.join(__dirname, 'database', 'data.json'), JSON.stringify(data))
	return res.json({
		userId: data.at(-1).userId 
	})
})

app.post('/write', async (req, res) => {
	const {userId, text, file} = await req.body
	
	for (let el of data) {
		if (el.userId == userId) {
			data.push({"userId": userId[0],"username":el.username,"profileImg":el.profileImg, "img":path.basename(file), "text":text[0]})
			break
		}
	}
	
    fs.writeFileSync(path.join(__dirname, 'database', 'data.json'), JSON.stringify(data))
	return res.end('OK')
})

app.listen(PORT, () => console.log('server is ready at http://192.168.42.212:' + PORT))