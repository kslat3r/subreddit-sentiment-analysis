class Scorer {
  constructor (lang) {
    this.lang = lang
    this.emojis = require(`./lang/${this.lang}/emojis.json`)
    this.negators = require(`./lang/${this.lang}/negators.json`)
    this.words = require(`./lang/${this.lang}/words.json`)
  }

  score (tokens) {
    const out = {
      score: 0,
      tokens: [],
      scoringTokens: [],
      average: 0,
      scoringAverage: 0
    }

    tokens.forEach((token, i) => {
      // score

      let score = 0

      if (this.emojis[token]) {
        score = this.emojis[token]
      }

      if (this.words[token]) {
        score = this.words[token]
      }

      const prevWord = tokens[i - 1]

      if (prevWord) {
        const negator = this.negators[tokens[i - 1]]

        if (negator) {
          score *= negator
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

    // get avergaes

    out.average = out.score / out.tokens.length
    out.scoringAverage = out.score / (out.scoringTokens.length || 1)

    return out
  }
}

module.exports = Scorer
