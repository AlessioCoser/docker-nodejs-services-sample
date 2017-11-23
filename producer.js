const amqp = require('amqplib')

async function producer (queueName, connectionString) {
  var connection = await amqp.connect(connectionString)
  var channel = await connection.createChannel()
  var ok = await channel.assertQueue(queueName)

  if (ok) {
    await channel.sendToQueue(queueName, Buffer.from('something to do'))
  }

  await channel.close()
  await connection.close()
}

producer('tasks', 'amqp://queue')
