var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
const QueueProducer = require('./lib/queue_producer')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let producer = new QueueProducer('amqp://queue', 'tasks')

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.post('/send', async function (req, res) {
  console.log(`producing "${req.body.message}"`)
  producer.produce(req.body.message)

  res.redirect('/')
})

app.listen(3000, async function () {
  await producer.waitForConnection()
  console.log('Example app listening on port 3000!')
})
