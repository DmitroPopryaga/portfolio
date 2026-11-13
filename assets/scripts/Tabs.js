class Tabs {
  selectors = {
    root: '[data-js-tabs]',
    button: '[data-js-tabs-button]',
    content: '[data-js-tabs-content]',
    indicator: '[data-js-tabs-indicator]',
  }

  stateClasses = {
    isActive: 'is-active',
    isReady: 'is-ready',
    isAnimated: 'is-animated',
  }

  attributes = {
    // флаг на root: экземпляр синхронизируется с адресом (#skills, #project-matrix)
    hashSync: 'data-js-tabs-hash-sync',
  }

  config = {
    changeEventName: 'tabs:change',
    prevKeys: ['ArrowLeft', 'ArrowUp'],
    nextKeys: ['ArrowRight', 'ArrowDown'],
    titleSeparator: ' | ',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttonElements = this.getOwnElements(this.selectors.button)
    this.contentElements = this.getOwnElements(this.selectors.content)
    // подложка активного таба (необязательна)
    this.indicatorElement = this.getOwnElements(this.selectors.indicator)[0] ?? null
    this.isHashSync = Boolean(this.rootElement?.hasAttribute(this.attributes.hashSync))
    // вложенные табы (проекты) не трогают скролл и заголовок вкладки — это дело внешних
    this.isNested = Boolean(this.rootElement?.parentElement?.closest(this.selectors.root))
    this.baseTitle = document.title

    if (this.buttonElements.length === 0 || this.buttonElements.length !== this.contentElements.length) {
      console.warn('[Tabs] buttons not found or buttons/contents count mismatch')
      return
    }

    this.resizeObserver = this.indicatorElement ? new ResizeObserver(this.onButtonsResize) : null

    this.bindEvents()
    // Осознанное отступление от стандарта: начальная синхронизация с hash (прямые ссылки вида /#skills)
    this.activate(this.getInitialIndex(), { isUserAction: false })
  }

  /* Вложенные табы (список проектов внутри панели): берём только элементы своего root */
  getOwnElements(selector) {
    return [...(this.rootElement?.querySelectorAll(selector) ?? [])].filter((element) => (
      element.closest(this.selectors.root) === this.rootElement
    ))
  }

  get activeIndex() {
    return this.buttonElements.findIndex((buttonElement) => (
      buttonElement.classList.contains(this.stateClasses.isActive)
    ))
  }

  getHashId() {
    return decodeURIComponent(window.location.hash.slice(1))
  }

  /* Панель с этим id или панель, внутри которой он лежит: #project-matrix открывает и «Projects» */
  getIndexById(id) {
    if (!id) return -1

    const selector = `#${CSS.escape(id)}`

    return this.contentElements.findIndex((contentElement) => (
      contentElement.id === id || contentElement.querySelector(selector)
    ))
  }

  /* Заголовок вкладки по разделу: «Projects | Dmitro Poprjaga — …»; первый раздел — исходный заголовок */
  updateTitle(index) {
    const label = this.buttonElements[index].textContent.trim()

    document.title = index === 0 ? this.baseTitle : `${label}${this.config.titleSeparator}${this.baseTitle}`
  }

  getInitialIndex() {
    const hashIndex = this.isHashSync ? this.getIndexById(this.getHashId()) : -1

    if (hashIndex !== -1) return hashIndex

    return Math.max(this.activeIndex, 0)
  }

  activate(index, { isUserAction }) {
    this.buttonElements.forEach((buttonElement, buttonIndex) => {
      const isActive = buttonIndex === index

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
      // все табы доступны по Tab (без roving tabindex); стрелки — дополнительный способ
      buttonElement.setAttribute('aria-selected', String(isActive))
    })

    this.contentElements.forEach((element, contentIndex) => {
      const isActive = contentIndex === index

      element.classList.toggle(this.stateClasses.isActive, isActive)
      element.hidden = !isActive
    })

    this.updateIndicator()

    const isMain = this.isHashSync && !this.isNested

    if (isMain) {
      this.updateTitle(index)
    }

    if (!isUserAction) return

    // На мобильных скроллится страница: новый раздел открывается с начала
    if (isMain) {
      window.scrollTo({ top: 0 })
    }

    // сигнал другим компонентам (HeaderMenu закрывает меню)
    this.rootElement.dispatchEvent(new CustomEvent(this.config.changeEventName, { bubbles: true }))
  }

  /*
    Подложка переезжает к активной кнопке. Кнопка в скрытой панели имеет нулевой размер —
    тогда ждём ResizeObserver, который сработает, когда панель покажут.
  */
  updateIndicator() {
    const buttonElement = this.buttonElements[this.activeIndex]

    if (!this.indicatorElement || !buttonElement?.offsetWidth) return

    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = buttonElement
    const { style, classList } = this.indicatorElement

    style.setProperty('--tabs-indicator-x', `${offsetLeft}px`)
    style.setProperty('--tabs-indicator-y', `${offsetTop}px`)
    style.setProperty('--tabs-indicator-width', `${offsetWidth}px`)
    style.setProperty('--tabs-indicator-height', `${offsetHeight}px`)

    if (classList.contains(this.stateClasses.isReady)) return

    // первая расстановка — без анимации, переезды включаем со следующего кадра
    classList.add(this.stateClasses.isReady)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => classList.add(this.stateClasses.isAnimated))
    })
  }

  /* Ручная активация (WAI-ARIA APG): стрелки двигают фокус, Enter/Space/клик выбирают таб */
  focusButton(index) {
    const lastIndex = this.buttonElements.length - 1
    const normalizedIndex = index < 0 ? lastIndex : index > lastIndex ? 0 : index

    this.buttonElements[normalizedIndex].focus()
  }

  onButtonClick = (event) => {
    const index = this.buttonElements.indexOf(event.currentTarget)

    if (index === this.activeIndex) return

    // pushState не скроллит к якорю и не вызывает hashchange, поэтому activate вызываем сами
    if (this.isHashSync) {
      window.history.pushState(null, '', `#${this.contentElements[index].id}`)
    }

    this.activate(index, { isUserAction: true })
  }

  onButtonKeydown = (event) => {
    const currentIndex = this.buttonElements.indexOf(event.currentTarget)
    const { key } = event

    if (this.config.prevKeys.includes(key)) {
      this.focusButton(currentIndex - 1)
    } else if (this.config.nextKeys.includes(key)) {
      this.focusButton(currentIndex + 1)
    } else if (key === 'Home') {
      this.focusButton(0)
    } else if (key === 'End') {
      this.focusButton(this.buttonElements.length - 1)
    } else {
      return
    }

    event.preventDefault()
  }

  /*
    Назад/вперёд в браузере и обычные ссылки вида href="#skills" (логотип, кнопка Contact).
    hashchange срабатывает и при переходе по истории, если hash отличается, — popstate не нужен.
  */
  onWindowHashChange = () => {
    const id = this.getHashId()
    // «Назад» до исходного адреса без hash возвращает на первый таб
    const index = id ? this.getIndexById(id) : 0

    if (index === -1 || index === this.activeIndex) return

    this.activate(index, { isUserAction: true })
  }

  /* id панели совпадает с hash, поэтому браузер сам прокручивает к ней при загрузке /#skills.
     На мобильных панель уходит под sticky-хедер: возвращаем страницу в начало. */
  onWindowLoad = () => {
    if (this.getIndexById(this.getHashId()) === -1) return

    window.scrollTo({ top: 0 })
  }

  /* Шрифт догрузился, сменился брейкпоинт или панель стала видимой — пересчитываем подложку */
  onButtonsResize = () => {
    this.updateIndicator()
  }

  bindEvents() {
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.addEventListener('click', this.onButtonClick)
      buttonElement.addEventListener('keydown', this.onButtonKeydown)
      this.resizeObserver?.observe(buttonElement)
    })
    // fluid-отступы между кнопками меняют сам tablist, даже если кнопки остались прежними
    this.resizeObserver?.observe(this.indicatorElement.parentElement)

    if (!this.isHashSync) return

    window.addEventListener('hashchange', this.onWindowHashChange)

    if (this.isNested) return

    window.addEventListener('load', this.onWindowLoad, { once: true })
  }
}

const rootSelector = '[data-js-tabs]'

class TabsCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element)
    })
  }
}

export default TabsCollection
