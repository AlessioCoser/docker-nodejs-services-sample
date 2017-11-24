const QueueConsumer = require('./lib/queue_consumer')

function consumeAction (msg) {
  if (msg !== null) {
    console.log('consumed msg: ', msg.content.toString())
  }
}

async function startConsumer (connectionString, queueName) {
  var consumer = new QueueConsumer(connectionString, queueName)
  await connectionLoop(consumer)
  await consumer.start(consumeAction)
}

async function connectionLoop (consumer) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      console.log('... connecting ...')
      let err = await consumer.connect()
      if (err) {
        reject(err)
      } else {
        resolve(null)
      }
    }, 1000)
  })
  .then(() => console.log('... connected ...'))
  .catch(() => {
    console.log('Could not connect to Queue, retrying...')
    return connectionLoop(consumer)
  })
}

startConsumer('amqp://queue', 'tasks')
