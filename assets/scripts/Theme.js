class Theme {
  selectors = {
    button: '[data-js-theme-button]',
    favicon: '[data-js-theme-favicon-dark]',
  }

  stateClasses = {
    lightTheme: 'light-theme',
  }

  attributes = {
    faviconDark: 'data-js-theme-favicon-dark',
    faviconLight: 'data-js-theme-favicon-light',
  }

  config = {
    storageKey: 'theme',
    themes: {
      light: 'light',
      dark: 'dark',
    },
    // новая тема расходится кругом от кнопки
    reveal: {
      duration: 600,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    },
    reducedMotionQuery: '(prefers-reduced-motion: reduce)',
  }

  constructor() {
    this.buttonElement = document.querySelector(this.selectors.button)
    // иконка вкладки не видит класс темы на странице, поэтому меняем сам файл (необязательна)
    this.faviconElement = document.querySelector(this.selectors.favicon)
    // класс ставит инлайн-скрипт в <head> до отрисовки, поэтому тема живёт на <html>
    this.themeTargetElement = document.documentElement
    this.reducedMotionQueryList = window.matchMedia(this.config.reducedMotionQuery)

    if (!this.buttonElement) {
      console.warn('[Theme] button not found')
      return
    }

    this.bindEvents()
    // Осознанное отступление от стандарта: синхронизируем aria-pressed с уже применённой темой
    this.apply(this.themeTargetElement.classList.contains(this.stateClasses.lightTheme))
  }

  get canReveal() {
    return typeof document.startViewTransition === 'function' && !this.reducedMotionQueryList.matches
  }

  saveTheme(theme) {
    try {
      localStorage.setItem(this.config.storageKey, theme)
    } catch {
      // приватный режим / запрет storage: тема просто не запомнится
    }
  }

  apply(isLight) {
    this.themeTargetElement.classList.toggle(this.stateClasses.lightTheme, isLight)
    this.buttonElement.setAttribute('aria-pressed', String(isLight))
    this.updateFavicon(isLight)
  }

  updateFavicon(isLight) {
    if (!this.faviconElement) return

    const href = this.faviconElement.getAttribute(isLight ? this.attributes.faviconLight : this.attributes.faviconDark)
    this.faviconElement.setAttribute('href', href)
  }

  /* Круг от центра кнопки до самого дальнего угла экрана */
  getRevealClipPath() {
    const { left, top, width, height } = this.buttonElement.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    return [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
  }

  /*
    View Transitions: браузер снимает «скриншот» старой темы, мы меняем класс,
    и новая тема проявляется кругом поверх старой. Без поддержки API или при
    «уменьшении движения» тема просто переключается.
  */
  switchTheme(isLight) {
    if (!this.canReveal) {
      this.apply(isLight)
      return
    }

    const clipPath = this.getRevealClipPath()
    const transition = document.startViewTransition(() => this.apply(isLight))

    transition.ready.then(() => {
      this.themeTargetElement.animate({ clipPath }, this.config.reveal)
    })
  }

  onButtonClick = () => {
    const isLight = !this.themeTargetElement.classList.contains(this.stateClasses.lightTheme)

    this.switchTheme(isLight)
    this.saveTheme(isLight ? this.config.themes.light : this.config.themes.dark)
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
  }
}

export default Theme
