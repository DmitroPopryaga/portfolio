class Copy {
  selectors = {
    source: '[data-js-copy-source]',
    button: '[data-js-copy-button]',
    label: '[data-js-copy-label]',
    status: '[data-js-copy-status]',
  }

  stateClasses = {
    // на кнопке: показывает и прорисовывает галочку
    isCopied: 'is-copied',
  }

  config = {
    resetDelay: 2000,
    labels: {
      copied: 'Copied',
      success: 'Email copied to clipboard',
      fallback: 'Copying is unavailable, the email is selected — press Ctrl+C',
    },
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.sourceElement = this.rootElement?.querySelector(this.selectors.source)
    this.buttonElement = this.rootElement?.querySelector(this.selectors.button)
    // меняем только подпись: внутри кнопки есть декоративный блик, его нельзя стирать
    this.labelElement = this.buttonElement?.querySelector(this.selectors.label)
    this.statusElement = this.rootElement?.querySelector(this.selectors.status)
    this.defaultLabel = this.labelElement?.textContent.trim()
    this.resetTimeoutId = null

    if (!this.sourceElement || !this.buttonElement || !this.labelElement) {
      console.warn('[Copy] required elements not found')
      return
    }

    this.bindEvents()
  }

  getText() {
    return this.sourceElement.textContent.trim()
  }

  /* role="status" озвучивает только изменение текста: очищаем, затем пишем сообщение */
  announce(message) {
    if (!this.statusElement) return

    this.statusElement.textContent = ''
    requestAnimationFrame(() => {
      this.statusElement.textContent = message
    })
  }

  /* Без HTTPS или при запрете доступа к буферу выделяем текст, чтобы его можно было скопировать вручную */
  selectSource() {
    const range = document.createRange()
    const selection = window.getSelection()

    range.selectNodeContents(this.sourceElement)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  showCopied() {
    clearTimeout(this.resetTimeoutId)

    this.labelElement.textContent = this.config.labels.copied
    this.buttonElement.classList.add(this.stateClasses.isCopied)
    this.announce(this.config.labels.success)

    this.resetTimeoutId = setTimeout(this.reset, this.config.resetDelay)
  }

  reset = () => {
    clearTimeout(this.resetTimeoutId)
    this.resetTimeoutId = null

    this.labelElement.textContent = this.defaultLabel
    this.buttonElement.classList.remove(this.stateClasses.isCopied)
  }

  onButtonClick = async () => {
    const text = this.getText()

    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      this.showCopied()
    } catch {
      this.selectSource()
      this.announce(this.config.labels.fallback)
    }
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
  }
}

const rootSelector = '[data-js-copy]'

class CopyCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Copy(element)
    })
  }
}

export default CopyCollection
