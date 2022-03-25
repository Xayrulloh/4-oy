const express = require('express'), app = express(), PORT = process.env.PORT ?? 5000, path = require('path')

app.set('views', path.join(__dirname, 'public'))

app.use((req, res, next) => {
    res.render = file => {
        return res.sendFile(path.join(app.get('views'), file + '.html'))
    }
    next()
})

app.get('/', (req, res) => res.render('index'))

app.listen(PORT, () => console.log('http://localhost:' + PORT))


