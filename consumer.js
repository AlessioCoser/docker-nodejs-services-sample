const amqp = require('amqplib')

function consumeAction (channel) {
  return function (msg) {
    if (msg !== null) {
      console.log('consumed msg: ', msg.content.toString())
      channel.ack(msg)
    }
  }
}

async function startConsumer (queueName, connectionString) {
  var connection = await amqp.connect(connectionString)
  var channel = await connection.createChannel()
  var ok = await channel.assertQueue(queueName)

  if (ok) {
    channel.consume(queueName, consumeAction(channel))
  }

  console.log(' [*] Waiting for messages. To exit press CTRL+C')
}

startConsumer('tasks', 'amqp://queue')
