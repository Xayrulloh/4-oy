const http = require('http'), fs = require('fs'), path = require('path'), PORT = process.env.PORT || 5000
let purposes = require('./database/purposes.json'), expanse = require('./database/expanse.json'), income = require('./database/income.json')

function serverFunction(request, response) {
    const url = request.url.toLowerCase(), method = request.method.toUpperCase()

// GET
    if (url.slice(0, 7) == '/income' && method == 'GET') {
		if (!isNaN(+url.split('/').at(-1))) {
			let res = ''
			income.find(el => el.incomeId == url.split('/').at(-1) ? res = el : '')
			res ? '' : res = 'this userId is not exist'
			return response.end(JSON.stringify(res))
		} else return response.end(JSON.stringify(income))
    } 
    else if (url.slice(0, 8) == '/expanse' && method == 'GET') {
		if (!isNaN(+url.split('/').at(-1))) {
			let res = ''
			expanse.find(el => el.expanseId == url.split('/').at(-1) ? res = el : '')
			res ? '' : res = 'this userId is not exist'
			return response.end(JSON.stringify(res))
		} else return response.end(JSON.stringify(expanse))
    } 
    else if (url.slice(0, 9) == '/purposes' && method == 'GET') {
		if (!isNaN(+url.split('/').at(-1))) {
			let res = ''
			purposes.find(el => el.purposeId == url.split('/').at(-1) ? res = el : '')
			res ? '' : res = 'this purposeId is not exist'
			return response.end(JSON.stringify(res))
		} else return response.end(JSON.stringify(purposes))
    } 
    else if (url == '/balance' && method == 'GET') {
		let totalIncome = income.reduce((acc, el) => acc += el.amount, 0), totalExpanse = expanse.reduce((acc, el) => acc += el.amount, 0), totalBalance = totalIncome - totalExpanse
		return response.end(JSON.stringify({totalIncome, totalExpanse, totalBalance}))
    }

// POST
    else if (url == '/expanse' && method == 'POST') {
		let store = ''
		request.on('data', (chunk) => store += chunk)
		request.on('end', () => {
			store = JSON.parse(store)
			let purpose = ''
			purposes.find(el => {if (el.purposeId == store.purposeId && el.type == 'expanse') purpose = el.text})
			if (purpose && store.amount && !isNaN(+store.amount)) {
				expanse.push({
					"expanseId": expanse.at(-1).expanseId + 1,
					"amount": +store.amount,
					"expansePurpose": {
						"purposeId": +store.purposeId,
						purpose,
					},
					"date": new Date().toISOString().slice(0, 10)
				})
				fs.writeFileSync('./database/expanse.json', JSON.stringify(expanse))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The expanse added!",
					data: expanse.at(-1)
				}))
			} else error(response)
		})
    }
    else if (url == '/income' && method == 'POST') {
        let store = ''
		request.on('data', (chunk) => store += chunk)
		request.on('end', () => {
			store = JSON.parse(store)
			let purpose = ''
			purposes.find(el => {if (el.purposeId == store.purposeId && el.type == 'income') purpose = el.text})
			if (purpose && store.amount && !isNaN(+store.amount)) {
				income.push({
					"incomeId": income.at(-1).incomeId + 1,
					"amount": +store.amount,
					"incomePurpose": {
						"purposeId": +store.purposeId,
						purpose,
					},
					"date": new Date().toISOString().slice(0, 10)
				})
				fs.writeFileSync('./database/income.json', JSON.stringify(income))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The income added!",
					data: income.at(-1)
				}))
			} else error(response)
		})
    } 
	else if (url == '/purposes' && method == 'POST') {
		let store = ''
		request.on('data', (chunk) => store += chunk)
		request.on('end', () => {
			let check = true
			store = JSON.parse(store)
			let id = purposes.at(-1).purposeId
			purposes.find(el => {if (el.text == store.text && el.type == store.type) check = false})
			if (store.type == 'income' && store.text && isNaN(+store.text) && check) {
				purposes.push({"purposeId":id,"type":store.type,"text":store.text})
				fs.writeFileSync('./database/purposes.json', JSON.stringify(purposes))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The purpose added!",
					data: purposes.at(-1)
				}))
			}
			else if (store.type == 'expanse' && store.text && isNaN(+store.text) && check) {
				purposes.push({"purposeId":id,"type":store.type,"text":store.text})
				fs.writeFileSync('./database/purposes.json', JSON.stringify(purposes))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The purpose added!",
					data: purposes.at(-1)
				}))
			} else error(response)
					
		})
    } 

// PUT
    else if (url == '/income' && method == 'PUT') {
        let store = ''
		request.on('data', (chunk) => store += chunk)
		request.on('end', () => {
			store = JSON.parse(store)
			let check = ''
			income.find(el => el.incomeId == store.incomeId ? check = '1' : '')
			purposes.find(el => {if (el.purposeId == store.purposeId && el.type == 'income') check += '1'})
			if (!isNaN(+store.incomeId) && !isNaN(+store.amount) && !isNaN(+store.purposeId) && check.length == 2) {
				let text = '', show
				purposes.forEach(el => {el.purposeId == store.purposeId ? text = el.text : ''});
				income.forEach(el => {if (el.incomeId == store.incomeId) {show = el; el.amount = +store.amount; el.incomePurpose['purpose'] = text; el.incomePurpose['purposeId'] = +store.purposeId}})
				fs.writeFileSync('./database/income.json', JSON.stringify(income))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The income changed!",
					data: show
				}))
			} else error(response)
			})
    } 
    else if (url == '/expanse' && method == 'PUT') {
        let store = ''
		request.on('data', (chunk) => store += chunk)
		request.on('end', () => {
			store = JSON.parse(store)
			let check = ''
			expanse.find(el => el.expanseId == store.expanseId ? check = '1' : '')
			purposes.find(el => {if (el.purposeId == store.purposeId && el.type == 'expanse') check += '1'})
			if (!isNaN(+store.expanseId) && !isNaN(+store.amount) && !isNaN(+store.purposeId) && check.length == 2) {
				let text = '', show
				purposes.forEach(el => {el.purposeId == store.purposeId ? text = el.text : ''});
				expanse.forEach(el => {if (el.expanseId == store.expanseId) {show = el; el.amount = +store.amount; el.expansePurpose['purpose'] = text; el.expansePurpose['purposeId'] = +store.purposeId}})
				fs.writeFileSync('./database/expanse.json', JSON.stringify(expanse))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The expanse changed!",
					data: show
				}))
			} else error(response)
			})
    }

// DELETE
    else if (url == '/expanse' && method == 'DELETE') {
		let store = ''
		request.on('data', (chunk) => store += chunk)
		request.on('end', () => {
			let check = false
			store = JSON.parse(store)
			expanse.find(el => el.expanseId == store.expanseId ? check = true : '')
			if (check) {
				let expanseCopy = []
				expanse.forEach(el => el.expanseId != store.expanseId ? expanseCopy.push(el) : '')
				fs.writeFileSync('./database/expanse.json', JSON.stringify(expanseCopy))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The expanse changed!",
					data: expanseCopy
				}))
			}
			else error(response)
		})
    }
    else if (url == '/income' && method == 'DELETE') {
		let store = ''
		request.on('data', (chunk) => store += chunk)
		request.on('end', () => {
			let check = false
			store = JSON.parse(store)
			income.find(el => el.incomeId == store.incomeId ? check = true : '')
			if (check) {
				let incomeCopy = []
				income.forEach(el => el.incomeId != store.incomeId ? incomeCopy.push(el) : '')
				fs.writeFileSync('./database/income.json', JSON.stringify(incomeCopy))
				response.setHeader('Content-Type', 'application/json')
				response.end(JSON.stringify({
					status: "OK",
					message: "The income changed!",
					data: incomeCopy
				}))
			}
			else error(response)
		})
    }
}

const app = http.createServer(serverFunction)
app.listen(PORT, () => console.log('server is listening on http://localhost:' + PORT))

function error(response) {
	response.setHeader('Content-Type', 'application/json')
		response.end(JSON.stringify({
		status: 404,
		message: "Invalid input",
		data: "Deeng"
	}))
}











