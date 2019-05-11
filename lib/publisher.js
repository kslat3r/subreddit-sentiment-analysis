const EventEmitter = require('events')
const { PubSub } = require('@google-cloud/pubsub')

class Publisher extends EventEmitter {
  constructor (config, logger) {
    super()

    this.pubSub = new PubSub()
    this.subredditInsertedTopicName = config.subredditInsertedTopicName
    this.subredditUpdatedTopicName = config.subredditUpdatedTopicName
    this.averageComputedTopicName = config.averageComputedTopicName
    this.logger = logger
  }

  subredditInserted (data) {
    return this.publish(this.subredditInsertedTopicName, data)
  }

  subredditUpdated (data) {
    return this.publish(this.subredditUpdatedTopicName, data)
  }

  averageComputed (data) {
    return this.publish(this.averageComputedTopicName, data)
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
