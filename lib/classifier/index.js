class Scorer {
  constructor (config, logger) {
    this.lang = config.lang
    this.logger = logger
    this.emojis = require(`./lang/${this.lang}/emojis.json`)
    this.negators = require(`./lang/${this.lang}/negators.json`)
    this.words = require(`./lang/${this.lang}/words.json`)
  }

  classify (tokens) {
    const out = {
      score: 0,
      average: 0,
      tokens: [],
      scoringTokens: []
    }

    tokens.forEach((token, i) => {
      this.logger.debug(`Evaluating token "${token}"`)

      // score

      let score = 0

      if (this.emojis[token]) {
        score = this.emojis[token]

        this.logger.debug(`Evaluated token "${token}" as ${score}`)
      }

      if (this.words[token]) {
        score = this.words[token]

        this.logger.debug(`Evaluated token "${token}" as ${score}`)
      }

      const prevWord = tokens[i - 1]

      if (prevWord) {
        const negator = this.negators[tokens[i - 1]]

        if (negator) {
          score *= negator

          this.logger.debug(`Negating token "${token}" with negator "${prevWord}"`)
        }
      }

      out.score += score

      // tokens

      const item = { token, score }

      out.tokens.push(item)

      if (score !== 0) {
        out.scoringTokens.push(item)
      }
    })

    // get average

    out.average = out.score / (out.scoringTokens.length || 1)

    this.logger.debug(`Evaluated tokens "${Object.values(out.scoringTokens).map(item => item.token).join(' ')}" as ${out.average}`)

    return out
  }
}

module.exports = Scorer
