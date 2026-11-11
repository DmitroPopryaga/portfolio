class Theme {
  stateClasses = {
    lightTheme: 'light-theme',
  }

  config = {
    storageKey: 'theme',
    themes: {
      light: 'light',
      dark: 'dark',
    },
  }

  constructor(buttonElement) {
    this.buttonElement = buttonElement
    // класс ставит инлайн-скрипт в <head> до отрисовки, поэтому тема живёт на <html>
    this.themeTargetElement = document.documentElement

    if (!this.buttonElement) {
      console.warn('[Theme] button not found')
      return
    }

    this.bindEvents()
    // Осознанное отступление от стандарта: синхронизируем aria-pressed с уже применённой темой
    this.apply(this.themeTargetElement.classList.contains(this.stateClasses.lightTheme))
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
  }

  onButtonClick = () => {
    const isLight = !this.themeTargetElement.classList.contains(this.stateClasses.lightTheme)

    this.apply(isLight)
    this.saveTheme(isLight ? this.config.themes.light : this.config.themes.dark)
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
  }
}

const rootSelector = '[data-js-theme-button]'

class ThemeCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Theme(element)
    })
  }
}

export default ThemeCollection
