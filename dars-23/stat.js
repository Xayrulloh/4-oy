const [,, expanseOrIncome] = process.argv, fs = require('fs')
let income = JSON.parse(fs.readFileSync('./database/income.json', 'UTF-8')), expanse = JSON.parse(fs.readFileSync('./database/expanse.json', 'UTF-8')), purposes = JSON.parse(fs.readFileSync('./database/purposes.json', 'UTF-8')), obj = {}, res = {amount: [], purpose: []}
if (expanseOrIncome == 'income') {
    for (let el of income) {
        obj[el.id] ? obj[el.id] += el.amount : obj[el.id] = el.amount
    }
    for (let index in obj) {
        res.amount.push(obj[index])
        res.purpose.push(purposes[index].text)
    }
    console.table(res);
} else if (expanseOrIncome == 'expanse') {
    for (let el of expanse) {
        obj[el.id] ? obj[el.id] += el.amount : obj[el.id] = el.amount
    }
    for (let index in obj) {
        res.amount.push(obj[index])
        res.purpose.push(purposes[index].text)
    }
    console.table(res);
}


