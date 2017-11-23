const amqp = require('amqplib')

async function consumer (queueName, connectionString) {
  var connection = await amqp.connect(connectionString)
  var channel = await connection.createChannel()
  var ok = await channel.assertQueue(queueName)

  if (ok) {
    channel.consume(queueName, function (msg) {
      if (msg !== null) {
        console.log('consumed msg: ', msg.content.toString())
        channel.ack(msg)
      }
    })
  }

  console.log(' [*] Waiting for messages. To exit press CTRL+C')
}

consumer('tasks', 'amqp://queue')
