class HeaderMenu {
  selectors = {
    headerMenu: '[data-js-header-menu]',
    burgerButton: '[data-js-header-burger-button]',
    menuLink: '[data-js-header-menu-link]',
  }

  stateClasses = {
    showMenu: 'show-menu',
    isActive: 'is-active',
  }

  constructor() {
    this.headerMenuElement = document.querySelector(this.selectors.headerMenu)
    this.burgerButtonElement = document.querySelector(this.selectors.burgerButton)
    this.menuLinkElements = this.headerMenuElement.querySelectorAll(this.selectors.menuLink)

    if (!this.headerMenuElement
      || !this.burgerButtonElement) return

    if(this.menuLinkElements.length === 0) return

    this.isOpen = false

    this.bindEvents()
  }

  handleMenuLinkClick = () => {
    if(this.isOpen) {
      this.onButtonClick()
    }
  }

  handleClickOutside = (event) => {
    if (this.isOpen
      && !this.headerMenuElement.contains(event.target)
      && !this.burgerButtonElement.contains(event.target)) {
      this.onButtonClick()
    }
  }

  onButtonClick = () => {
    this.isOpen = !this.isOpen
    this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
    this.headerMenuElement.classList.toggle(this.stateClasses.showMenu)

    if (this.isOpen) {
      document.addEventListener('click', this.handleClickOutside)
    } else {
      this.removeListeners()
    }
  }

  removeListeners = () => {
    document.removeEventListener('click', this.handleClickOutside)
  }

  bindEvents() {
    this.burgerButtonElement.addEventListener('click', this.onButtonClick)
    this.menuLinkElements.forEach(element => {
      element.addEventListener('click', this.handleMenuLinkClick)
    })
  }
}

export default HeaderMenu