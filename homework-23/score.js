const fs = require('fs'), [,, toDo, who, score, comment] = process.argv;
let students = require('./students.json'), scores = require('./infoStudents.json');

if (toDo != 'DELETE' && toDo != 'PUT' && toDo != 'POST') console.log('Deeng you entered wrong comand'); 

if (toDo === 'POST') {
    if ((who && score) && typeof +who === 'number' && typeof +score === 'number' && isNaN(+comment)) {
        let check = false;
        students.filter(el => el.studentId == who ? check = true : '')
        if (check) {
            scores.push({studentId: +who, scoreId: scores[scores.length - 1].scoreId + 1, date: new Date().toISOString().slice(0, 10), comment: comment})
            fs.writeFileSync('./infoStudents.json', JSON.stringify(scores))
            console.log('score added successfully');
        } else console.log('This user doesnt exist');
    } else console.log('Deeng Syntax error');
}

if (toDo === 'DELETE') {
    let check = false;
    scores.filter(el => el.scoreId == who ? check = true : '')
    if (check) {
        let scoresCopy = [];
        scores.filter(el => el.scoreId != +who ? scoresCopy.push(el) : '')
        fs.writeFileSync('./infoStudents.json', JSON.stringify(scoresCopy))
    } else console.log('This scoreId doesnt exist');
}

if (toDo === 'PUT') {
    let check = false;
    scores.filter(el => el.scoreId == who ? check = true : '')
    if (check && score) {
        scores.filter(el => {if (el.scoreId === +who) el.score = +score})
        fs.writeFileSync('./infoStudents.json', JSON.stringify(scores))
        console.log('score changed successfully');
    } else console.log('This scoreId doesnt exist');
}

