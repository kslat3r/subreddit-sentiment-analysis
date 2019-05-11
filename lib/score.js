const EventEmitter = require('events')

class Score extends EventEmitter {
  constructor (subredditId, classification, logger) {
    super()

    this.tableName = 'scores'
    this.subredditId = subredditId
    this.classification = classification
    this.logger = logger
  }

  async save (db) {
    let result
    let scoreId

    try {
      this.logger.info(`Inserting score for subreddit "${this.subredditId}"`)

      const data = {
        subredditId: this.subredditId,
        score: this.classification.average
      }

      result = await db.insert(this.tableName, data)
      scoreId = result.insertId
    } catch (e) {
      this.logger.error(e.message)
    }

    // retrieve record

    let results

    try {
      results = await db.select(this.tableName, ['*'], { id: scoreId })
    } catch (e) {
      console.log(e)
      this.logger.error(e.message)

      return
    }

    result = results[0]

    if (result) {
      this.emit('updated', result)
    }

    return result
  }
}

module.exports = Score
