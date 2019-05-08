const EventEmitter = require('events')

class Score extends EventEmitter {
  constructor (subredditId, classification, logger) {
    super()

    this.tableName = 'dailyScores'
    this.subredditId = subredditId
    this.classification = classification
    this.logger = logger
  }

  async save (db) {
    let results

    // daily scores table

    try {
      results = await db.select(this.tableName, ['id', 'score', 'count'], {
        subredditId: this.subredditId,
        'DATE(created)': 'CURDATE()'
      })
    } catch (e) {
      this.logger.error(e.message)

      return
    }

    let result = results[0]
    let scoreId

    try {
      if (!result) {
        // insert

        this.logger.info(`Score result not found for today for subreddit "${this.subredditId}", inserting`)

        const data = {
          subredditId: this.subredditId,
          score: this.classification.average,
          count: 1
        }

        result = await db.insert(this.tableName, data)
        scoreId = result.insertId
      } else {
        // update

        this.logger.info(`Score result found for today for subreddit "${this.subredditId}", updating`)

        const data = {
          score: result.score + this.classification.average,
          count: result.count + 1
        }

        await db.update(this.tableName, data, { id: result.id })
        scoreId = result.id
      }
    } catch (e) {
      this.logger.error(e.message)
    }

    // retrieve record

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
