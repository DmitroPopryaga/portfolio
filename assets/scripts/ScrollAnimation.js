class ScrollAnimation {
  selectors = {
    list: '[data-js-scroll-animation-list]'
  }

  constructor() {
    this.listElements = document.querySelectorAll(this.selectors.list)
    this.init()
  }

  init() {
    this.listElements.forEach(track => {
      if (track.dataset.clonesAdded === 'true') {
        return
      }

      const originalCards = Array.from(track.children)

      originalCards.forEach(card => {
        const clone = card.cloneNode(true)
        clone.setAttribute('aria-hidden', 'true')
        track.appendChild(clone)
      })

      track.dataset.clonesAdded = 'true'
    })
  }
}

export default ScrollAnimation