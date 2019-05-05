const CommentStream = require('./lib/comment-stream')
const Tokeniser = require('./lib/tokeniser')
const Classifier = require('./lib/classifier')
const config = require('./config')

const commentStream = new CommentStream(config.url)
const tokeniser = new Tokeniser()
const classifier = new Classifier(config.lang)

commentStream.on('comment', (comment) => {
  const tokens = tokeniser.tokenise(comment.body)
  const score = classifier.score(tokens)

  score.subreddit = comment.subreddit
  score.comment = comment.body
})

commentStream.on('error', err => console.error(err))

commentStream.start()
