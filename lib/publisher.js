const EventEmitter = require('events')
const { PubSub } = require('@google-cloud/pubsub')

class Publisher extends EventEmitter {
  constructor (config, logger) {
    super()

    this.pubSub = new PubSub()
    this.insertTopicName = config.insertTopicName
    this.updateTopicName = config.updateTopicName
    this.logger = logger
  }

  scoreInsert (data) {
    return this.publish(this.insertTopicName, data)
  }

  scoreUpdate (data) {
    return this.publish(this.updateTopicName, data)
  }

  async publish (topic, data) {
    let messageId

    try {
      messageId = await this.pubSub.topic(topic).publish(Buffer.from(JSON.stringify(data)))
    } catch (e) {
      this.emit('error', e)

      return
    }

    this.logger.info(`Message with ID "${messageId}" published`)

    return messageId
  }
}

module.exports = Publisher
