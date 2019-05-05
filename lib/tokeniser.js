class Tokeniser {
  tokenise (str) {
    return str
      .toLowerCase()
      .replace(/\n/g, ' ')
      .replace(/[.,/#!$%^&*;:{}=_`"~()?]/g, '')
      .split(' ')
  }
}

module.exports = Tokeniser
