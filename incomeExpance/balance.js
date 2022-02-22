const [,,arg] = process.argv, fs = require('fs');

let balance = JSON.parse(fs.readFileSync('./data.json', 'utf8')), expance = balance['expance'], income = balance['income'], all = income - expance
let res = {"Expance": '$' + expance, "Income": '$' + income, "Balance":  '$' + all}

arg == '--more' ? console.table(res) : console.log('$' + all);
