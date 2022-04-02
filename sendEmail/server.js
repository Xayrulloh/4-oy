const express = require('express'), app = express(), nodemailer = require('nodemailer'), otpGenerator = require('otp-generator'), code = otpGenerator.generate(6, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false})

app.use(express.json())

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xayrullohabduvohidov713@gmail.com',
        pass: 'xx2002abd',
    }
})

let mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err);
        console.log('ok', info);
    })
}

app.post('/register', (req, res) => {
    let {username, email} = req.body
    
    mailer({
        from: 'xayrullohabduvohidov713@gmail.com',
        to: email,
        subject: 'Password',
        text: code,
        html: `<h1>Hello ${username}</h1><p>Please pay me 4$</p><p>Your password ${code}<p>`
    })
    res.end()
})

app.listen(5000)