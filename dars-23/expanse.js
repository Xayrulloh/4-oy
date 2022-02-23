const [,, purposeId, amount] = process.argv
const fs = require('fs')

let expanse = fs.readFileSync('./database/expanse.json', 'UTF-8')
let purposes = fs.readFileSync('./database/purposes.json', 'UTF-8')

expanse = JSON.parse(expanse.trim() || null) || []
purposes = JSON.parse(purposes.trim() || null) || []

if(purposeId && amount) {
	try {

		if(isNaN(+purposeId) || isNaN(+amount)) {
			throw new Error("Arguments must be number!")
		}	
	
		if(
			!purposes.find(el => {
				return el.id == purposeId && el.type == 'expanse'
			})
		) {
			throw new Error("Invalid purpose ID!")
		}
	
		let newExpanse = {
			id: expanse.length ? expanse.at(-1).id + 1 : 1,
			amount: +amount,
			purpose: purposeId,
			date: new Date()
		}
	
		expanse.push(newExpanse)
	
		fs.writeFileSync('./database/expanse.json', JSON.stringify(expanse, null, 4))

		console.log('> Expanse added successfully!')
	} catch(error) {
		console.log(error.message)
	}
} else {
	try {
		const totalExpanse = expanse.reduce((acc, el) => acc + +el.amount, 0)

		expanse.map(el => {
			let puposeText = purposes.find(purpose => purpose.id == el.purpose).text
			el.purpose = puposeText
			el.date = new Date(el.date).toISOString().slice(0, 10)
			el.amount = '$' + el.amount
		})
	
		console.log('> Expanse table')
		console.table(expanse)
		console.log('> Total Expanse')
		console.table({ totalExpanse: '$' + totalExpanse })

	} catch(error) {
		console.log(error.message)
		console.table([])
	}
}