const [,,,arg] = process.argv, fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json', 'utf8')), expance = data['expance'], income = data['income']

if (typeof +arg === 'number') {
    console.log('Xarajat ro\'yxatiga qo\'shildi');
    fs.writeFileSync('./data.json', JSON.stringify({
        "income": +income,
        "expance": +expance + +arg,
    }))
}
