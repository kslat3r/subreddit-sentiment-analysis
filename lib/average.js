const EventEmitter = require('events')

class Score extends EventEmitter {
  constructor (subredditId, logger) {
    super()

    this.subredditId = subredditId
    this.logger = logger
  }

  async compute (db) {
    this.logger.info(`Computing average for subreddit "${this.subredditId}`)

    let results

    try {
      results = await db.execute(`select id, scoreSum / count as average, subredditId, created from (select id, sum(score) as scoreSum, count(*) as count, subredditId, created from scores where subredditId = "${this.subredditId}" and date(created) = date(now()) group by date(created)) as average`)
    } catch (e) {
      this.logger.error(e.message)
    }

    if (results.length) {
      this.emit('computed', results[0])
    }
  }
}

module.exports = Score
