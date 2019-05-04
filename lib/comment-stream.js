const EventEmitter = require('events')
const request = require('request-promise')

class CommentStream extends EventEmitter {
  constructor (url) {
    super()

    this.url = url
    this.interval = null
    this.previousIds = []
  }

  start () {
    this.interval = setInterval(() => {
      this.fetch.apply(this)
    }, 1000)
  }

  stop () {
    clearInterval(this.interval)
  }

  async fetch () {
    let response

    try {
      response = await request({
        method: 'GET',
        uri: this.url,
        json: true
      })
    } catch (e) {
      this.emit('error', e)
    }

    if (response && response.data && response.data.children) {
      this.filterDuplicates(response.data.children).forEach(comment => this.emit('comment', comment.data))
    }
  }

  filterDuplicates (comments) {
    if (this.previousIds.length > 1000) {
      this.previousIds.slice(500)
    }

    const out = []

    comments.forEach((comment) => {
      if (!this.previousIds.includes(comment.data.id)) {
        this.previousIds.push(comment.data.id)
        out.push(comment)
      }
    })

    return out
  }
}

module.exports = CommentStream
