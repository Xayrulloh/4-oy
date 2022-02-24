const fs = require('fs'), [,, toDo, who, change] = process.argv;
let students = require('./students.json'), scores = require('./infoStudents.json');

if (toDo != 'DELETE' && toDo != 'PUT' && toDo != 'GET' && toDo != 'POST') console.log('Deeng you entered wrong comand'); 

if (toDo === 'POST') {
    if (who || isNaN(+who)) {
        students.push({studentName: who, studentId: students[students.length - 1].studentId + 1})
        console.log(`${who} added successfully`);
        fs.writeFileSync('./students.json', JSON.stringify(students))
    } else {
        console.log('Deeng you entered nothing or Syntax error');
    }
}

if (toDo === 'GET') {
    if (who || !isNaN(+who)) {
        let check = false, name = ''
        students.filter(el => {if (+who === el.studentId) {check = true; name = el.studentName}})
        if (check) {
            let id = [], score = [], date = [], comment = []
            scores.filter(el => {if (el.studentId == +who) {id.push(el.scoreId); score.push(el.score); date.push(el.date); comment.push(el.comment)}})
            if (id.length) {
                console.log(`username --> ${name}`);
                console.table({id, score, date, comment});
            } else {
                console.log(`${name} had'nt score yet`);
            }
        } else {
            console.log('this student doesn\'t exist in our database');
        }
    } else if (!who) {
        for (let el of students) {
            for (let score of scores) {
                if (el.studentId == score.studentId) {
                    el.totalScore ? el.totalScore += score.score : el.totalScore = score.score
                }
            }
        }
        students.forEach(el => el.totalScore ? '' : el.totalScore = 0)
        let temp = 0
        for (let a = 0; a < students.length; a++) {
            for (let b = 0; b < students.length; b++) {
                if (students[a].totalScore > students[b].totalScore) {
                    temp = students[a]
                    students[a] = students[b]
                    students[b] = temp
                }
            }
        }
        console.table(students);
    }
}

if (toDo === 'DELETE') {
    if (who) {
        let studentsCopy = [], scoresCopy = [], name = ''
        students.filter(el => {if(el.studentId == who) {name = el.studentName} else studentsCopy.push(el)})
        scores.filter(el => el.studentId != who ? scoresCopy.push(el) : '')
        if (students.length === studentsCopy.length) return console.log('this student not exist');
        fs.writeFileSync('./students.json', JSON.stringify(studentsCopy))
        fs.writeFileSync('./infoStudents.json', JSON.stringify(scoresCopy))
        console.log(`${name} deleted successfully`);
    } else {
        console.log('Deeng Syntax error');
    }
}

if (toDo === 'PUT') {
    if (who && change) {
        if (isNaN(+change)) {
            let originName = ''
            students.filter(el => {if (el.studentId === +who) el.studentName = change; originName = el.studentName})
            fs.writeFileSync('./students.json', JSON.stringify(students));
            console.log(`${originName} changed to ${change}`);
        } else console.log('You entered not a string');
    } else {
        console.log('Deeng Syntax error');
    }
}
