const amqp = require('amqplib')

class QueueProducer {
  constructor (connectionString, queueName) {
    this.connectionString = connectionString
    this.queueName = queueName

    this.connection = null
    this.channel = null
  }

  async waitForConnection () {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        console.log('... connecting to Queue ...')
        let err = await this.connect()
        if (err) {
          reject(err)
        } else {
          resolve(null)
        }
      }, 1000)
    })
    .then(() => console.log('... connected to Queue ...'))
    .catch(() => {
      console.log('Could not connect to Queue, retrying...')
      return this.waitForConnection()
    })
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
}

function handleError (promise) {
  return promise
  .then(data => [data, null])
  .catch(err => [null, err])
}

module.exports = QueueProducer
