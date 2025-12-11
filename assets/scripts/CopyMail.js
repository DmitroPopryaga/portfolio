class CopyMail {
  selectors = {
    button: '[data-js-copy-button]',
    email: '[data-js-copy-email]',
  }

  constructor() {
    this.buttonElement = document.querySelector(this.selectors.button)
    if(!this.buttonElement) return

    this.emailElement = document.querySelector(this.selectors.email)
    if(!this.emailElement) return

    this.defaultButtonHTML = this.buttonElement.innerHTML
    this.isAnimating = false
    this.timeoutId = null

    this.bindEvents()
  }

  debounce(func, wait) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  changeButtonText = () => {
    if(this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.buttonElement.innerHTML = 'Email copied ✔'
    this.isAnimating = true

    this.timeoutId = setTimeout(() => {
      this.resetButtonText()
    }, 2000)
  }

  resetButtonText = () => {
    this.buttonElement.innerHTML = this.defaultButtonHTML
    this.isAnimating = false
    this.timeoutId = null
  }

  onButtonClick = async () => {
    if(this.isAnimating) {
      return
    }

    const emailText = this.getEmailText()
    if(!emailText) return

    try {
      await navigator.clipboard.writeText(emailText)
      this.changeButtonText()
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  getEmailText() {
    return this.emailElement.textContent?.trim()
  }

  bindEvents() {
    this.debouncedClick = this.debounce(this.onButtonClick, 300)
    this.buttonElement.addEventListener('click', this.debouncedClick)
  }
}

export default CopyMail

