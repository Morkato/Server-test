const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const server = require('http').createServer(app)
const socket = require('socket.io')(server)
const messages = JSON.parse(fs.readFileSync(path.join("src", "messages.json")).toString())

app.use(express.static(path.join(__dirname, "public")))
app.set('views', path.join(__dirname, "public"))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use(require('./src/controllers/home'))
app.use('/api', express.static(path.join(__dirname, 'public')))

socket.on('connection', sock => {
  console.log(`New connection id ${sock.id}`)

  sock.emit('receiveMeg', messages)
  sock.on('message', data => {
    messages.push(data)
    if(data["icon"] == null) data["icon"] = "https://a.pinatafarm.com/400x400/9d19564598/gigachad.jpg"
    sock.emit('onmessage', data)
    sock.broadcast.emit('onmessage', data)
    fs.writeFileSync(path.join("src", "messages.json"), JSON.stringify(messages, null, 2), {encoding: 'utf-8'})
  })
})

server.listen(5500, () => console.log("server running..."))