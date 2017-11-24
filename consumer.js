const QueueClient = require('./lib/queue_client')

function consumeAction (msg) {
  if (msg !== null) {
    console.log('consumed msg: ', msg.content.toString())
  }
}

async function startConsumer (connectionString, queueName) {
  var q = new QueueClient(connectionString, queueName)

  let err = await q.connect()
  if (err) {
    console.log('Connection error: ', err)
    process.exit(1)
  }

  await q.startConsumer(consumeAction)

  console.log('[*] Waiting for messages. To exit press CTRL+C')
}

startConsumer('amqp://queue', 'tasks')
