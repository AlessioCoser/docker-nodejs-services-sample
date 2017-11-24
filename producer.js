const path = require('path')
const amqp = require('amqplib')
const args = process.argv
var message = null

if (args.length !== 3) {
  console.log('Usage:\n')
  console.log(path.basename(args[0]) + ' ' + path.basename(args[1]) + ' "[message]"')
  process.exit(1)
}

message = args[2]

async function producer (queueName, connectionString) {
  var connection = await amqp.connect(connectionString)
  var channel = await connection.createChannel()
  var ok = await channel.assertQueue(queueName)

  if (ok) {
    await channel.sendToQueue(queueName, Buffer.from(message))
  }

  await channel.close()
  await connection.close()
}

producer('tasks', 'amqp://queue')
