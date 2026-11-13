class VideoPlayer {
  selectors = {
    video: '[data-js-video-player-video]',
    button: '[data-js-video-player-button]',
  }

  stateClasses = {
    isPlaying: 'is-playing',
  }

  config = {
    tabsChangeEventName: 'tabs:change',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.videoElement = this.rootElement?.querySelector(this.selectors.video)
    this.buttonElement = this.rootElement?.querySelector(this.selectors.button)

    if (!this.videoElement || !this.buttonElement) {
      console.warn('[VideoPlayer] required elements not found')
      return
    }

    this.bindEvents()
    /*
      Осознанное отступление от стандарта: без JS работают нативные controls,
      а кнопку Play показываем и controls прячем только когда плеер готов
    */
    this.videoElement.controls = false
    this.buttonElement.hidden = false
  }

  /* Старт по кнопке: появляются controls, фокус переходит на видео (кнопка скрывается) */
  onButtonClick = () => {
    this.rootElement.classList.add(this.stateClasses.isPlaying)
    this.videoElement.controls = true
    this.videoElement.focus()
    this.videoElement.play().catch(() => {
      // браузер не дал запустить (например, нет данных) — controls уже показаны, пользователь запустит сам
    })
  }

  /* Сменился таб: если плеер оказался в скрытой панели — ставим на паузу, чтобы звук не играл фоном */
  onDocumentTabsChange = () => {
    if (this.rootElement.closest('[hidden]')) {
      this.videoElement.pause()
    }
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
    document.addEventListener(this.config.tabsChangeEventName, this.onDocumentTabsChange)
  }
}

const rootSelector = '[data-js-video-player]'

class VideoPlayerCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new VideoPlayer(element)
    })
  }
}

export default VideoPlayerCollection
