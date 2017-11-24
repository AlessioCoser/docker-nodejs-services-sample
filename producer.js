const path = require('path')
const args = process.argv

const QueueClient = require('./lib/queue_client')
var message = null

if (args.length !== 3) {
  console.log('Usage:\n')
  console.log(path.basename(args[0]) + ' ' + path.basename(args[1]) + ' "[message]"')
  process.exit(1)
}

message = args[2]

async function producer (queueName, connectionString) {
  var q = new QueueClient(connectionString, queueName)

  let err = await q.connect()
  if (err) {
    console.log('Connection error: ', err)
    process.exit(1)
  }

  await q.produce(message)
  await q.disconnect()
}

producer('tasks', 'amqp://queue')
