import Copy from './Copy.js'

const rootSelector = '[data-js-copy]'

class CopyCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Copy(element)
    })
  }
}

export default CopyCollection
