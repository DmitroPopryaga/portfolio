class Confirm {
  selectors = {
    cancelButton: '[data-js-confirm-cancel]',
    acceptButton: '[data-js-confirm-accept]',
  }

  attributes = {
    // кнопка-открывашка указывает id диалога: data-js-confirm-open="resume-dialog"
    open: 'data-js-confirm-open',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.cancelButtonElement = this.rootElement?.querySelector(this.selectors.cancelButton)
    this.acceptButtonElement = this.rootElement?.querySelector(this.selectors.acceptButton)
    // открывашки живут вне диалога, поэтому ищем их по id диалога во всём документе
    this.openButtonElements = this.rootElement?.id
      ? [...document.querySelectorAll(`[${this.attributes.open}="${this.rootElement.id}"]`)]
      : []

    if (!this.cancelButtonElement || !this.acceptButtonElement || this.openButtonElements.length === 0) {
      console.warn('[Confirm] required elements not found')
      return
    }

    this.bindEvents()
  }

  open() {
    this.rootElement.showModal()
  }

  /* Фокус после close() браузер сам возвращает на открывашку */
  close() {
    this.rootElement.close()
  }

  /* Без JS открывашка — обычная ссылка download; с JS вместо скачивания показываем подтверждение */
  onOpenButtonClick = (event) => {
    event.preventDefault()
    this.open()
  }

  onCancelButtonClick = () => {
    this.close()
  }

  /* «Да» — настоящая ссылка download: браузер скачает файл, нам остаётся закрыть окно */
  onAcceptButtonClick = () => {
    this.close()
  }

  /* Клик по затемнённому фону: событие приходит на сам <dialog>, но за пределами его прямоугольника */
  onRootClick = (event) => {
    if (event.target !== this.rootElement) return

    const { left, right, top, bottom } = this.rootElement.getBoundingClientRect()
    const isInside = event.clientX >= left && event.clientX <= right
      && event.clientY >= top && event.clientY <= bottom

    if (!isInside) {
      this.close()
    }
  }

  bindEvents() {
    this.openButtonElements.forEach((openButtonElement) => {
      openButtonElement.addEventListener('click', this.onOpenButtonClick)
    })
    this.cancelButtonElement.addEventListener('click', this.onCancelButtonClick)
    this.acceptButtonElement.addEventListener('click', this.onAcceptButtonClick)
    this.rootElement.addEventListener('click', this.onRootClick)
  }
}

const rootSelector = '[data-js-confirm]'

class ConfirmCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Confirm(element)
    })
  }
}

export default ConfirmCollection
