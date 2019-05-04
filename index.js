const CommentStream = require('./lib/comment-stream')
const config = require('./config')

const commentStream = new CommentStream(config.url)

commentStream.on('comment', comment => console.log(`${comment.subreddit}: ${comment.body}`))
commentStream.on('error', err => console.error(err))

commentStream.start()
