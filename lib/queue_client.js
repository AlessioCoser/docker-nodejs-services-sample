const amqp = require('amqplib')

class QueueClient {
  constructor (connectionString, queueName) {
    this.connectionString = connectionString
    this.queueName = queueName

    this.connection = null
    this.channel = null
  }

  async connect () {
    let err

    [this.connection, err] = await handleError(amqp.connect(this.connectionString))
    if (err) {
      return err
    }

    [this.channel, err] = await handleError(this.connection.createChannel())
    if (err) {
      return err
    }

    let ok
    [ok, err] = await handleError(this.channel.assertQueue(this.queueName))
    if (err) {
      return err
    }

    return null
  }

  async disconnect () {
    await this.channel.close()
    await this.connection.close()
  }

  async produce (message) {
    await this.channel.sendToQueue(this.queueName, Buffer.from(message))
  }

  async startConsumer (doForEveryItem) {
    this.channel.consume(this.queueName, (msg) => {
      doForEveryItem(msg)
      this.channel.ack(msg)
    })
  }
}

function handleError (promise) {
  return promise
  .then(data => [data, null])
  .catch(err => [null, err])
}

module.exports = QueueClient
