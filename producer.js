const QueueClient = require('./lib/queue_client')

async function producer (queueName, connectionString) {
  var q = new QueueClient(connectionString, queueName)

  let err = await q.connect()
  if (err) {
    console.log('Connection error: ', err)
    process.exit(1)
  }

  console.log('[*] Write something to push to Queue. Each line is a separate item.\n    (To exit write "quit")')

  var stdin = process.openStdin()
  stdin.addListener('data', async (d) => {
    let message = d.toString().trim()

    if (message === '') {
      console.log('** Empty message is not allowed! **')
      return
    }

    if (message === 'quit') {
      await q.disconnect()
      console.log('Disconnected from queue\nBye!')
      process.exit(0)
    }

    await q.produce(message)
  })
}

producer('tasks', 'amqp://queue')