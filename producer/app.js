var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
const QueueClient = require('./lib/queue_client')
let producer = new QueueClient('amqp://queue', 'tasks')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.post('/send', async function (req, res) {
  console.log(`producing "${req.body.message}"`)
  producer.produce(req.body.message)

  res.redirect('/')
})

app.listen(3000, async function () {
  let err = await producer.waitForConnection()
  if (err) {
    console.log(err.message)
    process.exit(1)
  }

  console.log('Example app listening on port 3000!')
})
