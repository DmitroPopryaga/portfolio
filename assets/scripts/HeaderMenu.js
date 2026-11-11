class HeaderMenu {
  selectors = {
    root: '[data-js-header]',
    menu: '[data-js-header-menu]',
    burgerButton: '[data-js-header-burger-button]',
  }

  stateClasses = {
    isOpen: 'is-open',
    isActive: 'is-active',
  }

  config = {
    desktopMediaQuery: '(width >= 768px)',
    tabsChangeEventName: 'tabs:change',
    labels: {
      open: 'Open menu',
      close: 'Close menu',
    },
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.menuElement = this.rootElement?.querySelector(this.selectors.menu)
    this.burgerButtonElement = this.rootElement?.querySelector(this.selectors.burgerButton)
    this.desktopMediaQueryList = window.matchMedia(this.config.desktopMediaQuery)

    if (!this.menuElement || !this.burgerButtonElement) {
      console.warn('[HeaderMenu] required elements not found')
      return
    }

    this.bindEvents()
  }

  get isOpen() {
    return this.menuElement.classList.contains(this.stateClasses.isOpen)
  }

  toggle(isOpen) {
    this.menuElement.classList.toggle(this.stateClasses.isOpen, isOpen)
    this.burgerButtonElement.classList.toggle(this.stateClasses.isActive, isOpen)
    this.burgerButtonElement.setAttribute('aria-expanded', String(isOpen))
    this.burgerButtonElement.setAttribute('aria-label', isOpen ? this.config.labels.close : this.config.labels.open)
  }

  /* Меню скрывается через visibility: если фокус был внутри, возвращаем его на бургер */
  close() {
    if (!this.isOpen) return

    const hasFocusInside = this.menuElement.contains(document.activeElement)

    this.toggle(false)

    if (hasFocusInside) {
      this.burgerButtonElement.focus()
    }
  }

  onBurgerButtonClick = () => {
    if (this.isOpen) {
      this.close()
    } else {
      this.toggle(true)
    }
  }

  onDocumentClick = (event) => {
    if (!this.isOpen || this.rootElement.contains(event.target)) return

    this.close()
  }

  onDocumentKeydown = (event) => {
    if (event.key !== 'Escape' || !this.isOpen) return

    this.toggle(false)
    this.burgerButtonElement.focus()
  }

  /* Событие от Tabs: пользователь выбрал раздел */
  onDocumentTabsChange = () => {
    this.close()
  }

  onDesktopMediaQueryChange = (event) => {
    if (event.matches) {
      this.toggle(false)
    }
  }

  bindEvents() {
    this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)
    document.addEventListener('click', this.onDocumentClick)
    document.addEventListener('keydown', this.onDocumentKeydown)
    document.addEventListener(this.config.tabsChangeEventName, this.onDocumentTabsChange)
    this.desktopMediaQueryList.addEventListener('change', this.onDesktopMediaQueryChange)
  }
}

const rootSelector = '[data-js-header]'

class HeaderMenuCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new HeaderMenu(element)
    })
  }
}

export default HeaderMenuCollection
