const config = require('./config')
const Logger = require('./lib/logger')
const DB = require('./lib/db')
const Scraper = require('./lib/scraper')
const Tokeniser = require('./lib/tokeniser')
const Classifier = require('./lib/classifier')
const Score = require('./lib/score')

const logger = new Logger(config.logger)
const db = new DB(config.db, logger)

db.on('connection', () => {
  const scraper = new Scraper(config.scraper, logger)
  const tokeniser = new Tokeniser(logger)
  const classifier = new Classifier(config.classifier, logger)

  scraper.on('comments', async (comments) => {
    for (const comment of comments) {
      const tokens = tokeniser.tokenise(comment.body)
      const classification = classifier.classify(tokens)

      await new Score(classification, comment.subreddit, logger)
        .save(db)
    }
  })

  scraper.on('error', err => logger.error(err))

  scraper.start()
})

db.on('error', err => logger.error(err))
