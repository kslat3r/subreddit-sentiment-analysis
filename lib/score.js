class Score {
  constructor (classification, subreddit, logger) {
    this.tableName = 'scores'
    this.classification = classification
    this.subreddit = subreddit
    this.logger = logger
  }

  async save (db) {
    let results

    try {
      results = await db.select(this.tableName, ['id', 'score', 'count'], {
        subreddit: this.subreddit,
        'DATE(created)': 'CURDATE()'
      })
    } catch (e) {
      this.logger.error(e)

      return
    }

    let result = results[0]

    try {
      if (!result) {
        this.logger.info(`Result not found for subreddit "${this.subreddit}", inserting`)

        result = await db.insert(this.tableName, {
          subreddit: this.subreddit,
          score: this.classification.average,
          count: 1
        })
      } else {
        this.logger.info(`Result found for subreddit "${this.subreddit}", updating`)

        result = await db.update(this.tableName, {
          score: result.score + this.classification.average,
          count: result.count + 1
        }, { id: result.id })
      }
    } catch (e) {
      this.logger.error(e)

      return
    }

    return result
  }
}

module.exports = Score
