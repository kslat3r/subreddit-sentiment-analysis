class Tokeniser {
  constructor (logger) {
    this.logger = logger
  }

  tokenise (str) {
    this.logger.debug(`Tokenising string ${str}`)

    return str
      .toLowerCase()
      .replace(/\n/g, ' ')
      .replace(/[.,/#!$%^&*;:{}=_`"~()?]/g, '')
      .split(' ')
  }
}

module.exports = Tokeniser
