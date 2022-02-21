// homework 1
const readline = require('readline'), rl = readline.createInterface({ input: process.stdin, output: process.stdout })

let questions = [
        {question: 'Qaysi method elementi arrayyi bowiga qowadi? \nA: Push, \nB: Pop, \nC: Shift, \nD: Unshift\n', answer: 'D'},
        {question: 'Qaysi method elementi arrayyi oxiriga qowadi?  \nA: Push, \nB: Pop, \nC: Shift, \nD: Unshift\n', answer: 'A'},
        {question: 'Qaysi method elementi arrayga qoshadi va chopadi ? \nA: Push, \nB: Pop, \nC: Splice, \nD: Unshift\n', answer: 'C'},
        {question: 'Qaysi method string ni elementini kotta qib qoyadi ? \nA: ToUpperCase, \nB: toLowerCase, \nC: yoku unaqasi, \nD: toUpperCase\n', answer: 'D'},
        {question: 'Qaysi method string ni elementini kichkina qib qoyadi ? \nA: ToLowerCase, \nB: toLowerCase, \nC: hammasi, \nD: toUpperCase\n', answer: 'B'},
        {question: 'Qaysi usul bilan stringni songa aylantirsa boladi?  \nA: Number(), \nB: +, \nC: Hammasi, \nD: new Number()\n', answer: 'C'},
        {question: 'Qaysi usul bilan stringga ogirsa boladi?  \nA: toString(), \nB: String(), \nC: "" +, \nD: hammasi\n', answer: 'D'},
        {question: 'Synchron va Asnychron ni farqi?  \nA: C va D variantla, \nB: qiziqcimisiz farqi yoku, \nC: asynchron quega ob qoyiladi va qachon vaqti kesa oshanda iwlidi, \nD: synchron 1 run boladi\n', answer: 'A'},
        {question: 'Javascript ti orqasida babi nima ishlidi?  \nA: javascript, \nB: c, \nC: NodeJs, \nD: v8\n', answer: 'B'},
        {question: 'Qaysi systema yaxwi?  \nA: Siz qaysini ishlatvokkan boses oshanisi, \nB: Windows, \nC: Mac, \nD: Linux\n', answer: 'A'}
], count = 0, ball = 0, res = {Allquestions: questions.length}

questions.sort(() => Math.random() - .5)

function recursive () {
    rl.question(`${count + 1}) ${questions[count].question}` , data => {
        if (count == questions.length - 1) {
            if (['A', 'B', 'C', 'D'].includes(data)) {
                if (data == questions[count].answer) ++ball
                res.correctAnswer = ball; 
                res.wrongAnswer = questions.length - ball; 
                console.table(res); 
                return rl.close()
            } else return recursive()
            } 
        else {
            if (['A', 'B', 'C', 'D'].includes(data)) {
                if (data == questions[count].answer) ++ball
                ++count
            }
            return recursive()
        }
    })
}

recursive()
















