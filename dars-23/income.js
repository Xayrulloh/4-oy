const [,, purposeId, amount] = process.argv
const fs = require('fs')

let income = fs.readFileSync('./database/income.json', 'UTF-8')
let purposes = fs.readFileSync('./database/purposes.json', 'UTF-8')

income = JSON.parse(income.trim() || null) || []
purposes = JSON.parse(purposes.trim() || null) || []

if(purposeId && amount) {
	try {

		if(isNaN(+purposeId) || isNaN(+amount)) {
			throw new Error("Arguments must be number!")
		}	
	
		if(
			!purposes.find(el => {
				return el.id == purposeId && el.type == 'income'
			})
		) {
			throw new Error("Invalid purpose ID!")
		}
	
		let newIncome = {
			id: income.length ? income.at(-1).id + 1 : 1,
			amount: +amount,
			purpose: purposeId,
			date: new Date()
		}
	
		income.push(newIncome)
	
		fs.writeFileSync('./database/income.json', JSON.stringify(income, null, 4))

		console.log('> Income added successfully!')
	} catch(error) {
		console.log(error.message)
	}
} else {
	try {
		const totalIncome = income.reduce((acc, el) => acc + +el.amount, 0)

		income.map(el => {
			let puposeText = purposes.find(purpose => purpose.id == el.purpose)?.text
			el.purpose = puposeText
			el.date = new Date(el.date).toISOString().slice(0, 10)
			el.amount = '$' + el.amount
		})
	
		console.log('> Income table')
		console.table(income)
		console.log('> Total Income')
		console.table({ totalIncome: '$' + totalIncome })

	} catch(error) {
		console.log(error.message)
		console.table([])
	}
}