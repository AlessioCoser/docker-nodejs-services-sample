var queueName = 'tasks'
var queueConnection = require('amqplib').connect('amqp://queue')

queueConnection
.then((connection) => {
  return connection.createChannel()
  .then(function (channel) {
    return channel.assertQueue(queueName)
    .then((ok) => channel.sendToQueue(queueName, Buffer.from('something to do')))
    .then(() => channel.close())
  })
  .finally(function () { connection.close() })
})
.catch(console.warn)
