const [,, expanseOrIncome, purpose] = process.argv, fs = require('fs')

let purposes = JSON.parse(fs.readFileSync('./database/purposes.json', 'UTF-8'))

if (purpose) {
    if (expanseOrIncome == 'expanse') {
        purposes.push({ "id": purposes[purposes.length - 1].id + 1, "type": "expanse", "text": purpose })
        console.log('purpose added successfully');
        fs.writeFileSync('./database/purposes.json', JSON.stringify(purposes))
    } else if (expanseOrIncome == 'income') {
        purposes.push({ "id": purposes[purposes.length - 1].id + 1, "type": "income", "text": purpose })
        console.log('purpose added successfully');
        fs.writeFileSync('./database/purposes.json', JSON.stringify(purposes))
    }
} else {
    let res = null
    if (expanseOrIncome == 'expanse') {
        res = purposes.filter(el => {
            return el.type == 'expanse'
        })
    } else if (expanseOrIncome == 'income') {
        res = purposes.filter(el => {
            return el.type == 'income'
        })
    }
    console.table(res)
}
