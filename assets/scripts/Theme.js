class Theme {
  selectors = {
    body: '[data-js-body]',
    button: '[data-js-theme-button]',
  }

  stateClasses = {
    lightTheme: 'light-theme',
  }

  constructor() {
    this.bodyElement = document.querySelector(this.selectors.body)
    this.buttonElement = document.querySelector(this.selectors.button)

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      this.bodyElement.classList.add(this.stateClasses.lightTheme)
    }

    this.bindEvents()
  }

  onButtonClick = () => {
    this.bodyElement.classList.toggle(this.stateClasses.lightTheme)

    if (this.bodyElement.classList.contains(this.stateClasses.lightTheme)) {
      localStorage.setItem('theme', 'light')
    } else {
      localStorage.setItem('theme', 'dark')
    }
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
  }
}

export default Theme