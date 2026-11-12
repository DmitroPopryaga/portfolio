class Tabs {
  selectors = {
    root: '[data-js-tabs]',
    button: '[data-js-tabs-button]',
    content: '[data-js-tabs-content]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  attributes = {
    // флаг на root: этот экземпляр управляет адресом страницы (#skills) и скроллом
    hashSync: 'data-js-tabs-hash-sync',
  }

  config = {
    changeEventName: 'tabs:change',
    prevKeys: ['ArrowLeft', 'ArrowUp'],
    nextKeys: ['ArrowRight', 'ArrowDown'],
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttonElements = this.getOwnElements(this.selectors.button)
    this.contentElements = this.getOwnElements(this.selectors.content)
    this.isHashSync = Boolean(this.rootElement?.hasAttribute(this.attributes.hashSync))

    if (this.buttonElements.length === 0 || this.buttonElements.length !== this.contentElements.length) {
      console.warn('[Tabs] buttons not found or buttons/contents count mismatch')
      return
    }

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

  getIndexById(id) {
    return this.contentElements.findIndex((contentElement) => contentElement.id === id)
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

    if (!isUserAction) return

    // На мобильных скроллится страница: новый раздел открывается с начала
    if (this.isHashSync) {
      window.scrollTo({ top: 0 })
    }

    // сигнал другим компонентам (HeaderMenu закрывает меню)
    this.rootElement.dispatchEvent(new CustomEvent(this.config.changeEventName, { bubbles: true }))
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

  bindEvents() {
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.addEventListener('click', this.onButtonClick)
      buttonElement.addEventListener('keydown', this.onButtonKeydown)
    })

    if (!this.isHashSync) return

    window.addEventListener('hashchange', this.onWindowHashChange)
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
