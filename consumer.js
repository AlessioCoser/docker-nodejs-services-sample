var queueName = 'tasks'
var queueConnection = require('amqplib').connect('amqp://queue')

queueConnection
.then((conn) => conn.createChannel())
.then(function (ch) {
  return ch.assertQueue(queueName).then(function (ok) {
    return ch.consume(queueName, function (msg) {
      if (msg !== null) {
        console.log('consume: ', msg.content.toString())
        ch.ack(msg)
      }
    })
  })
})
.catch(console.warn)
