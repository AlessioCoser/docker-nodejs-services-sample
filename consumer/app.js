const QueueClient = require('./lib/queue_client')
let consumer = new QueueClient('amqp://queue', 'tasks')

function consumeAction (msg) {
  if (msg !== null) {
    console.log('consumed msg: ', msg.content.toString())
  }
}

async function start (consumer) {
  let err = await consumer.waitForConnection()
  if (err) {
    console.log(err.message)
    process.exit(1)
  }

  await consumer.start(consumeAction)
}

start(consumer)
