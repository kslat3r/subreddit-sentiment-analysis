const EventEmitter = require('events')
const request = require('request-promise')

class Scraper extends EventEmitter {
  constructor (config, logger) {
    super()

    this.url = config.url
    this.intervalMs = config.intervalMs
    this.numCachedDuplicates = config.numCachedDuplicates
    this.logger = logger
    this.interval = null
    this.previousIds = []

    this.logger.info('Starting scraper')

    this.interval = setInterval(() => {
      this.fetch.apply(this)
    }, this.intervalMs)
  }

  stop () {
    this.logger.info('Stopping scraper')

    clearInterval(this.interval)
  }

  async fetch () {
    let response

    try {
      this.logger.info(`Fetching ${this.url}`)

      response = await request({
        method: 'GET',
        uri: this.url,
        json: true
      })
    } catch (e) {
      this.emit('error', e)
    }

    if (response && response.data && response.data.children) {
      const comments = this.filterDuplicates(response.data.children).map(item => item.data)

      this.emit('comments', comments)

      this.logger.info(`Emitted ${comments.length} comments`)
    }
  }

  filterDuplicates (comments) {
    if (this.previousIds.length > this.numCachedDuplicates) {
      this.previousIds.slice(this.numCachedDuplicates * 0.9)
    }

    const out = []

    comments.forEach((comment) => {
      if (!this.previousIds.includes(comment.data.id)) {
        this.previousIds.push(comment.data.id)

        out.push(comment)
      } else {
        this.logger.info(`Removed comment ID "${comment.data.id}" from subreddit "${comment.data.subreddit}"`)
      }
    })

    return out
  }
}

module.exports = Scraper
