const QueueClient = require('./lib/queue_client')

function consumeAction (msg) {
  if (msg !== null) {
    console.log('consumed msg: ', msg.content.toString())
  }
}

async function start (connectionString, queueName) {
  let consumer = new QueueClient('amqp://queue', 'tasks')

  try {
    await consumer.waitForConnection(1000)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }

  await consumer.start(consumeAction)
}

start('amqp://queue', 'tasks')
