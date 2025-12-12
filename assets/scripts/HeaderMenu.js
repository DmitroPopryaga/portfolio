class HeaderMenu {
  selectors = {
    headerMenu: '[data-js-header-menu]',
    burgerButton: '[data-js-header-burger-button]',
  }

  stateClasses = {
    showMenu: 'show-menu',
    isActive: 'is-active',
  }

  constructor() {
    this.menu = document.querySelector(this.selectors.headerMenu)
    this.burger = document.querySelector(this.selectors.burgerButton)

    if (!this.menu || !this.burger) return

    this.isOpen = false
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.handleEscape = this.handleEscape.bind(this)

    this.burger.addEventListener('click', () => this.toggle())
  }

  toggle() {
    this.isOpen = !this.isOpen
    this.burger.classList.toggle(this.stateClasses.isActive)
    this.menu.classList.toggle(this.stateClasses.showMenu)

    if (this.isOpen) {
      document.addEventListener('click', this.handleClickOutside)
      document.addEventListener('keydown', this.handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      this.removeListeners()
      document.body.style.overflow = ''
    }
  }

  handleClickOutside(e) {
    if (!this.menu.contains(e.target) && !this.burger.contains(e.target)) {
      this.toggle()
    }
  }

  handleEscape(e) {
    if (e.key === 'Escape') this.toggle()
  }

  removeListeners() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('keydown', this.handleEscape)
  }
}

export default HeaderMenu