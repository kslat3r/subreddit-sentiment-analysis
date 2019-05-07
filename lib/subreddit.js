const EventEmitter = require('events')

class Subreddit extends EventEmitter {
  constructor (name, logger) {
    super()

    this.tableName = 'subreddits'
    this.name = name
    this.logger = logger
  }

  async save (db) {
    let results

    try {
      results = await db.select(this.tableName, ['id', 'count'], {
        name: this.name
      })
    } catch (e) {
      this.logger.error(e.message)

      return
    }

    let result = results[0]

    try {
      if (!result) {
        this.logger.info(`Result not found for subreddit "${this.name}", inserting`)

        const data = {
          name: this.name,
          count: 1
        }

        result = await db.insert(this.tableName, data)

        this.emit('inserted', Object.assign({}, data, {
          id: result.insertId
        }))

        return result.insertId
      } else {
        this.logger.info(`Result found for subreddit "${this.name}", updating`)

        const data = {
          count: result.count + 1
        }

        await db.update(this.tableName, data, { id: result.id })

        this.emit('updated', Object.assign({}, data, {
          id: result.id,
          name: this.name
        }))

        return result.id
      }
    } catch (e) {
      this.logger.error(e.message)
    }
  }
}

module.exports = Subreddit
