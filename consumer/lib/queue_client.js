const amqp = require('amqplib')

class QueueClient {
  constructor (connectionString, queueName) {
    this.connectionString = connectionString
    this.queueName = queueName

    this.connection = null
    this.channel = null
    this.retry = 0
  }

  async waitForConnection (interval = 1000, maxRetry) {
    console.log('... connecting to Queue ...')

    if (maxRetry > 0) {
      if (this.retry > maxRetry) {
        throw new Error('Exceeded Max Retry. Exiting ...')
      }
      this.retry++
    }

    try {
      await this.connect()
      console.log('... connected to Queue ...')
    } catch (err) {
      console.log('Could not connect to Queue, retrying...')
      await this.wait(interval)
      await this.waitForConnection(maxRetry)
    }
  }

  async wait (time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  async connect () {
    this.connection = await amqp.connect(this.connectionString)
    this.channel = await this.connection.createChannel()
    await this.channel.assertQueue(this.queueName)

    return null
  }

  async disconnect () {
    await this.channel.close()
    await this.connection.close()
  }

  async produce (message) {
    await this.channel.sendToQueue(this.queueName, Buffer.from(message))
  }

  async start (doForEveryItem) {
    this.channel.consume(this.queueName, (msg) => {
      doForEveryItem(msg)
      this.channel.ack(msg)
    })
  }
}

module.exports = QueueClient
