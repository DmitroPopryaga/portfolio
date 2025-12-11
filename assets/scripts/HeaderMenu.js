class HeaderMenu {
  selectors = {
    headerMenu: '[data-js-header-menu]',
    burgerButton: '[data-js-header-burger-button]',
  }

  stateClasses = {
    showMenu: 'show-menu',
    isActive: 'is-active'
  }

  constructor() {
    this.headerMenuElement = document.querySelector(this.selectors.headerMenu)
    this.burgerButtonElement = document.querySelector(this.selectors.burgerButton)
    this.bindEvents()
  }

  onBurgerButtonClick = () => {
    this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
    this.headerMenuElement.classList.toggle(this.stateClasses.showMenu)
  }

  bindEvents() {
    this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)
  }
}

export default HeaderMenu