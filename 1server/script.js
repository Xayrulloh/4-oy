const fs = require('fs'), http = require('http')

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        let buffer = fs.readFileSync('index.html')
        return res.end(buffer)
    }
    else if (req.url == '/comic') {
        res.setHeader("Content-Type","video/mp4")
        let buffer = fs.readFileSync('comic.mp4')
        return res.end(buffer)
    }
    else if (req.url == '/nature') {
        res.setHeader("Content-Type","video/mp4")
        let buffer = fs.readFileSync('nature.MP4')
        return res.end(buffer)
    }
    else if (req.url == '/education') {
        res.setHeader("Content-Type","video/mp4")
        let buffer = fs.readFileSync('education.mp4')
        return res.end(buffer)
    }
    else return res.end('Deeng')
})

server.listen(5000, () => {console.log('server is on')})


