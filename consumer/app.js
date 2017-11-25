const QueueConsumer = require('./lib/queue_consumer')

function consumeAction (msg) {
  if (msg !== null) {
    console.log('consumed msg: ', msg.content.toString())
  }
}

async function startConsumer (connectionString, queueName) {
  var consumer = new QueueConsumer(connectionString, queueName)
  await consumer.waitForConnection()
  await consumer.start(consumeAction)
}

startConsumer('amqp://queue', 'tasks')
