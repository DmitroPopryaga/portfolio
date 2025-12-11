class HeaderScrollEffect {
  selectors = {
    header: '[data-js-header]',
  }

  stateClasses = {
    isScrolled: 'is-scrolled'
  }

  constructor() {
    this.headerElement = document.querySelector(this.selectors.header)
    this.threshold = 50
    this.bindEvents()
  }

  onScrollEffect = () =>  {
    const isScrolled = window.scrollY >= this.threshold

    this.headerElement.classList.toggle(this.stateClasses.isScrolled, isScrolled)
  }

  bindEvents () {
    window.addEventListener('scroll', this.onScrollEffect)
  }
}

export default HeaderScrollEffect