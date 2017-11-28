var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
const QueueClient = require('./lib/queue_client')

function startWebServer (producer) {
  var app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
  })

  app.post('/send', async (req, res) => {
    console.log(`producing "${req.body.message}"`)

    producer.produce(req.body.message)

    res.redirect('/')
  })

  app.listen(3000, async () => {
    console.log('Example app listening on port 3000!')
  })
}

async function start (connectionString, queueName) {
  let producer = new QueueClient(connectionString, queueName)

  try {
    await producer.waitForConnection(1000)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }

  startWebServer(producer)
}

start('amqp://queue', 'tasks')
