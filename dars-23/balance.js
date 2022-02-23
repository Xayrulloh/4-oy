const [,, flag] = process.argv
const fs = require('fs')

let income = fs.readFileSync('./database/income.json', 'UTF-8')
let expanse = fs.readFileSync('./database/expanse.json', 'UTF-8')

income = JSON.parse(income.trim() || null) || []
expanse = JSON.parse(expanse.trim() || null) || []

const totalIncome = income.reduce((acc, el) => acc + +el.amount, 0)
const totalExpanse = expanse.reduce((acc, el) => acc + +el.amount, 0)

let totalBalance = totalIncome - totalExpanse

if(flag == '--more') {
	console.table({ totalIncome, totalExpanse, totalBalance })
} else {
	console.table({ totalBalance })
}