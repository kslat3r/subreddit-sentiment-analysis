module.exports = {
  logger: {
    level: process.env.LOG_LEVEL || 'debug'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ssanalysis',
    password: process.env.DB_PASSWORD || 'S-mE{xVgn%h69}n!',
    database: process.env.DB_NAME || 'ssanalysis'
  },
  scraper: {
    url: process.env.SCRAPER_URL || 'https://www.reddit.com/r/all/comments/.json?limit=100',
    intervalMs: process.env.SCRAPER_INTERVAL_MS || 1000,
    numCachedDuplicates: process.env.SCRAPER_NUM_CACHED_DUPLICATES || 5000
  },
  classifier: {
    lang: process.env.CLASSIFIER_LANG || 'en'
  }
}
