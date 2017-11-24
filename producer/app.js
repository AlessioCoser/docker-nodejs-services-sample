var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
const QueueProducer = require('./lib/queue_producer')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './', 'index.html'))
})

app.post('/send', async function (req, res) {
  let producer = new QueueProducer('amqp://queue', 'tasks')
  let err = await producer.connect()
  if (err) {
    console.log('CONNECTION_ERROR: ', err)
    res.redirect('/?errorCode=CONNECTION_ERROR')
    return
  }
  console.log(`producing "${req.body.message}"`)
  producer.produce(req.body.message).then(() => producer.disconnect())

  res.redirect('/')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
