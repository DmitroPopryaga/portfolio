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
    // видно меньше этой доли — ставим на паузу (на мобильных видео уезжает при скролле)
    visibilityThreshold: 0.25,
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.videoElement = this.rootElement?.querySelector(this.selectors.video)
    this.buttonElement = this.rootElement?.querySelector(this.selectors.button)

    if (!this.videoElement || !this.buttonElement) {
      console.warn('[VideoPlayer] required elements not found')
      return
    }

    this.intersectionObserver = new IntersectionObserver(this.onIntersection, {
      threshold: this.config.visibilityThreshold,
    })

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

  /* Досмотрели до конца: возвращаем постер и кнопку Play, как до старта */
  onVideoEnded = () => {
    const hasFocusInside = this.rootElement.contains(document.activeElement)

    this.rootElement.classList.remove(this.stateClasses.isPlaying)
    this.videoElement.controls = false
    // load() сбрасывает видео к постеру (с preload="none" данные заново не качаются)
    this.videoElement.load()

    if (hasFocusInside) {
      this.buttonElement.focus()
    }
  }

  /* Видео ушло с экрана: пауза, чтобы оно не играло там, где его не видно */
  onIntersection = ([entry]) => {
    if (entry.isIntersecting || this.videoElement.paused) return

    this.videoElement.pause()
  }

  /* Сменился таб: если плеер оказался в скрытой панели — ставим на паузу, чтобы звук не играл фоном */
  onDocumentTabsChange = () => {
    if (this.rootElement.closest('[hidden]')) {
      this.videoElement.pause()
    }
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
    this.videoElement.addEventListener('ended', this.onVideoEnded)
    this.intersectionObserver.observe(this.rootElement)
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
